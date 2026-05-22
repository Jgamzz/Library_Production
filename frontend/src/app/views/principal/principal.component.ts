import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../../core/services/book.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard">
      <aside class="sidebar">
        <h3>Ordem Alfabética</h3>
        <button (click)="ordenar('AZ')">A - Z</button>
        <button (click)="ordenar('ZA')">Z - A</button>
        <button (click)="authService.logout()" class="btn-logout">Sair</button>
      </aside>

      <main class="main-content">
        <header class="header-top">
          <h1>Biblioteca</h1>
        </header>

        <section *ngIf="isAdmin" class="admin-panel">
          <h3>Gerenciamento de Acervo (Modo Admin)</h3>
          <form (ngSubmit)="adicionarLivro()" class="admin-form">
            <input type="text" [(ngModel)]="novoLivro.name" name="name" placeholder="Nome do Livro" required>
            <input type="text" [(ngModel)]="novoLivro.author" name="author" placeholder="Autor" required>
            <input type="number" [(ngModel)]="novoLivro.releaseYear" name="releaseYear" placeholder="Ano de Lançamento" required>
            <textarea [(ngModel)]="novoLivro.description" name="description" placeholder="Biografia / Descrição do livro" required></textarea>
            <div class="file-upload">
              <label>Capa do Livro: </label>
              <input type="file" (change)="onFileSelected($event)" required>
            </div>
            <button type="submit">Inserir Novo Livro</button>
          </form>
        </section>

        <section class="books-container">
          <div class="book-card" *ngFor="let livro of livros">
            <div class="clickable-area" (click)="verDetalhes(livro.id)">
              <img [src]="livro.image ? livro.image : 'https://via.placeholder.com/200x300?text=Sem+Capa'" alt="Capa">
              <h4>{{ livro.name }}</h4>
              <p class="author">Autor: {{ livro.author }}</p>
            </div>
            <button *ngIf="isAdmin" (click)="deletarLivro(livro.id)" class="delete-btn">Deletar Livro</button>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .dashboard { display: flex; height: 100vh; font-family: Arial, sans-serif; background: #f4f4f4; }
    .sidebar { width: 240px; background: #2c3e50; color: white; padding: 20px; display: flex; flex-direction: column; gap: 12px; box-shadow: 2px 0 5px rgba(0,0,0,0.1); }
    .sidebar h3 { font-size: 16px; border-bottom: 1px solid #34495e; padding-bottom: 10px; margin-top: 0; text-align: center; }
    .sidebar button { background: #34495e; color: white; border: none; padding: 12px; text-align: left; cursor: pointer; border-radius: 4px; font-weight: bold; transition: 0.2s; }
    .sidebar button:hover { background: #1abc9c; }
    .sidebar .btn-logout { background: #e74c3c; margin-top: auto; text-align: center; }
    .sidebar .btn-logout:hover { background: #c0392b; }
    .main-content { flex: 1; display: flex; flex-direction: column; overflow-y: auto; }
    .header-top { background: white; padding: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); text-align: center; color: #2c3e50; }
    .header-top h1 { margin: 0; font-size: 28px; letter-spacing: 1px; }
    .admin-panel { background: #e8f4fd; margin: 20px; padding: 20px; border-radius: 8px; border: 1px solid #b8daff; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .admin-form { display: flex; flex-direction: column; gap: 10px; max-width: 600px; }
    .admin-form input, .admin-form textarea { padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-family: Arial, sans-serif; }
    .admin-form textarea { height: 80px; resize: vertical; }
    .file-upload { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #555; }
    .admin-form button { background: #28a745; color: white; border: none; padding: 12px; font-weight: bold; cursor: pointer; border-radius: 4px; }
    .admin-form button:hover { background: #218838; }
    .books-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 25px; padding: 20px; }
    .book-card { background: white; border-radius: 8px; padding: 15px; box-shadow: 0 3px 10px rgba(0,0,0,0.08); display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.2s; }
    .book-card:hover { transform: translateY(-5px); }
    .clickable-area { cursor: pointer; }
    .book-card img { width: 100%; height: 260px; object-fit: cover; border-radius: 6px; }
    .book-card h4 { margin: 12px 0 6px; font-size: 16px; color: #2c3e50; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .book-card .author { font-size: 14px; color: #7f8c8d; margin: 0; }
    .delete-btn { background: #dc3545; color: white; border: none; padding: 8px; margin-top: 12px; border-radius: 4px; cursor: pointer; font-weight: bold; }
    .delete-btn:hover { background: #bd2130; }
  `]
})
export class PrincipalComponent implements OnInit {
  livros: any[] = [];
  isAdmin = false;
  selectedFile: File | null = null;
  novoLivro = { name: '', author: '', description: '', releaseYear: 2026 };

  constructor(private bookService: BookService, public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.carregarLivros();
  }

  carregarLivros() {
    this.bookService.listar().subscribe({
      next: (dados) => this.livros = dados,
      error: () => alert('Sua sessão expirou ou você não tem permissão para listar o acervo.')
    });
  }

  ordenar(tipo: string) {
    if (tipo === 'AZ') {
      this.livros.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      this.livros.sort((a, b) => b.name.localeCompare(a.name));
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  adicionarLivro() {
    if (!this.selectedFile) {
      alert('Por favor, selecione uma imagem para a capa.');
      return;
    }
    this.bookService.criar(this.novoLivro, this.selectedFile).subscribe({
      next: () => {
        this.carregarLivros();
        this.novoLivro = { name: '', author: '', description: '', releaseYear: 2026 };
        this.selectedFile = null;
      },
      error: () => alert('Falha ao inserir o livro. Verifique os campos do formulário.')
    });
  }

  deletarLivro(id: number) {
    if (confirm('Tem certeza absoluta que deseja remover este livro do acervo?')) {
      this.bookService.deletar(id).subscribe({
        next: () => this.carregarLivros(),
        error: () => alert('Ocorreu um erro ao tentar excluir o registro.')
      });
    }
  }

  verDetalhes(id: number) {
    this.router.navigate(['/livro', id]);
  }
}
