import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BookService } from './../../core/services/book.service';
import { AuthService } from './../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { Perfil } from '../../core/models/perfil';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="dashboard">
      <aside class="sidebar">
        <div class="sidebar-header">
          <h3>LIBRARY</h3>
        </div>
        <nav class="nav-group">

          <button *ngIf="perfil && perfil.name == 'Administrator'" (click)="abrirModal()" class="btn-create-trigger">
            <i class="fa-solid fa-plus"></i> + Criar Livro
          </button>

          <div class="divider"></div>
          <p class="nav-label">ORDENAÇÃO</p>
          <button (click)="ordenar('AZ')" class="nav-btn-sub">A - Z</button>
          <button (click)="ordenar('ZA')" class="nav-btn-sub">Z - A</button>
        </nav>

        <button (click)="authService.logout()" class="btn-logout">Sair do Sistema</button>
      </aside>

      <main class="main-content">
        <header  class="top-header">
          <h1 >Biblioteca <span class="badge" *ngIf="">Editor</span></h1>
        </header>

        <div class="content-padding">
          <section class="books-display">
            <h2 class="section-title">Livros Disponíveis</h2>

            <div class="books-grid">
              <div class="book-card" *ngFor="let livro of livros" (click)="verDetalhes(livro.id)">
                <div class="book-cover">
                  <img [src]="livro.image ? livro.image : 'https://via.placeholder.com/200x300?text=Sem+Capa'" alt="Capa">
                  <div class="overlay">Visualizar</div>
                </div>
                <div class="book-info">
                  <h4>{{ livro.name }}</h4>
                  <p class="author">Autor: {{ livro.author }}</p>
                  <p class="year">Ano: {{ livro.releaseYear }}</p>
                </div>
                <div class="admin-actions">
                  <button *ngIf="perfil && perfil.name == 'Administrator'" (click)="deletarLivro(livro.id); $event.stopPropagation()" class="btn-delete">Deletar</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <div class="modal-overlay" *ngIf="exibirModal">
        <div class="modal-card">
          <div class="modal-header">
            <h2>Novo Registro de Livro</h2>
            <button class="btn-close" (click)="fecharModal()">&times;</button>
          </div>

          <form (ngSubmit)="salvarNovoLivro()" class="modal-form">
            <div class="form-group">
              <label>Nome do Livro</label>
              <input type="text" [(ngModel)]="novoLivro.name" name="name" placeholder="Ex: Resident Evil: Code Veronica" required>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Autor</label>
                <input type="text" [(ngModel)]="novoLivro.author" name="author" placeholder="Ex: S. D. Perry" required>
              </div>
              <div class="form-group">
                <label>Ano Lançamento</label>
                <input type="number" [(ngModel)]="novoLivro.releaseYear" name="releaseYear" placeholder="2026" required>
              </div>
            </div>

            <div class="form-group">
              <label>Descrição / Sinopse</label>
              <textarea [(ngModel)]="novoLivro.description" name="description" rows="3" placeholder="Descrição do livro" required></textarea>
            </div>

            <div class="form-group">
              <label>Capa do Livro (image - string/binary)</label>
              <div class="file-drop-area">
                <input type="file" (change)="onFileSelected($event)" required>
                <p>Selecione o arquivo de imagem para upload</p>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-modal-cancel" (click)="fecharModal()">Cancelar</button>
              <button type="submit" class="btn-modal-save">Salvar Registro</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { display: flex; height: 100vh; background: #F8F9FA; font-family: 'Segoe UI', Tahoma, sans-serif; }

    /* SIDEBAR - Branco e Azul Bebê com inputs limpos */
    .sidebar { width: 260px; background: #FFFFFF !important; border-right: 1px solid #E0E0E0; display: flex; flex-direction: column; padding: 25px; box-sizing: border-box; }
    .sidebar-header h3 { color: #039BE5; margin-bottom: 30px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; }
    .nav-group { flex-grow: 1; }
    .nav-btn { width: 100%; text-align: left; background: none; border: none; padding: 12px 15px; border-radius: 8px; color: #2C3E50; margin-bottom: 5px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-weight: 500; }
    .nav-btn.active { background: #E1F5FE !important; color: #039BE5 !important; font-weight: bold; }

    /* BOTÃO + CRIAR LIVRO ABAIXO DE VER LIVROS */
    .btn-create-trigger { width: 100%; background: #039BE5; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 5px; margin-bottom: 15px; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
    .btn-create-trigger:hover { background: #0288D1; }

    .divider { height: 1px; background: #E0E0E0; margin: 15px 0; }
    .nav-label { font-size: 11px; color: #9E9E9E; font-weight: bold; margin-bottom: 10px; padding-left: 15px; }
    .nav-btn-sub { width: 100%; text-align: left; background: none; border: none; padding: 8px 15px; cursor: pointer; color: #616161; font-size: 13px; }
    .nav-btn-sub:hover { color: #039BE5; }

    .btn-logout { background: #FFEBEE; color: #D32F2F; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold; width: 100%; text-align: center; }
    .btn-logout:hover { background: #FFCDD2; }

    /* CONTEÚDO CENTRAL */
    .main-content { flex: 1; overflow-y: auto; background: #F8F9FA; display: flex; flex-direction: column; }
    .top-header { background: #FFFFFF; padding: 20px 40px; border-bottom: 1px solid #E0E0E0; }
    .top-header h1 { font-size: 24px; color: #2C3E50; margin: 0; font-weight: 700; }
    .badge { font-size: 12px; background: #E1F5FE; color: #039BE5; padding: 4px 12px; border-radius: 20px; margin-left: 10px; font-weight: bold; vertical-align: middle; }
    .content-padding { padding: 30px 40px; }

    /* GRID DE LIVROS (ESBOÇO) */
    .section-title { color: #2C3E50; margin: 0 0 25px 0; font-size: 20px; font-weight: 600; }
    .books-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 30px; }
    .book-card { background: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.02); transition: 0.3s; display: flex; flex-direction: column; border: 1px solid transparent; }
    .book-card:hover { transform: translateY(-5px); border-color: #B3E5FC; box-shadow: 0 8px 24px rgba(3, 155, 229, 0.08); }
    .book-cover { position: relative; height: 280px; background: #ECEFF1; }
    .book-cover img { width: 100%; height: 100%; object-fit: cover; }

    .overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(3, 155, 229, 0.4); color: white; display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.3s; font-weight: bold; }
    .book-card:hover .overlay { opacity: 1; }

    .book-info { padding: 15px; text-align: center; flex-grow: 1; }
    .book-info h4 { margin: 0 0 5px 0; color: #2C3E50; font-size: 16px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .author { font-size: 13px; color: #757575; margin: 0; }
    .year { font-size: 12px; color: #039BE5; font-weight: bold; margin-top: 5px; }

    .admin-actions { padding: 10px; border-top: 1px solid #F5F5F5; display: flex; justify-content: center; background: #FAFAFA; }
    .btn-delete { background: #FFEBEE; color: #D32F2F; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold; width: 100%; }
    .btn-delete:hover { background: #D32F2F; color: white; }

    /* ESTILIZAÇÃO DO MODAL FLUTUANTE */
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); display: flex; justify-content: center; align-items: center; z-index: 2000; }
    .modal-card { background: #FFFFFF; width: 100%; max-width: 520px; border-radius: 14px; padding: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.08); border: 1px solid #B3E5FC; box-sizing: border-box; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #E1F5FE; padding-bottom: 12px; }
    .modal-header h2 { color: #2C3E50; font-size: 18px; margin: 0; font-weight: 700; }
    .btn-close { background: none; border: none; font-size: 26px; cursor: pointer; color: #9E9E9E; line-height: 1; }

    .modal-form { display: flex; flex-direction: column; gap: 15px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group label { font-weight: 600; color: #2C3E50; font-size: 13px; }
    .form-group input, .form-group textarea { padding: 11px; border: 1px solid #E0E0E0; border-radius: 8px; background: #FAFAFA; font-family: inherit; font-size: 14px; box-sizing: border-box; }
    .form-group input:focus, .form-group textarea:focus { border-color: #B3E5FC; background: #FFFFFF; outline: none; }

    .file-drop-area { border: 2px dashed #B3E5FC; padding: 15px; text-align: center; border-radius: 8px; background: #FBFDFF; }
    .file-drop-area p { margin: 6px 0 0 0; font-size: 12px; color: #757575; }

    .modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 15px; border-top: 1px solid #F0F4F8; padding-top: 15px; }
    .btn-modal-cancel { background: #F5F5F5; color: #616161; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px; }
    .btn-modal-save { background: #039BE5; color: white; border: none; padding: 10px 25px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px; }
    .btn-modal-save:hover { background: #0288D1; }
  `]
})
export class PrincipalComponent implements OnInit {
  livros: any[] = [];
  isAdmin = false;
  exibirModal = false; // Estado do pop-up
  selectedFile: File | null = null;
  novoLivro = { name: '', author: '', description: '', releaseYear: 2026 };
  perfil: Perfil | undefined;
  constructor(private bookService: BookService, 
              public authService: AuthService, 
              private router: Router,
              private userService: UserService) {}

  ngOnInit() {

    this.carregarLivros();
    this.carregarPerfil();
  }

  carregarPerfil(){
    this.userService.obter()
          .subscribe({
            next: (items)=> {
              this.perfil = items
                  this.isAdmin = this.perfil && this.perfil.name == 'Administrator'
            },
            error: () => console.error('Erro ao buscar acervo.')
          })
  }

  carregarLivros() {
    this.bookService.listar().subscribe({
      next: (dados: any[]) => this.livros = dados,
      error: () => console.error('Erro ao buscar acervo.')
    });
  }

  abrirModal() {
    this.exibirModal = true;
  }

  fecharModal() {
    this.exibirModal = false;
    this.selectedFile = null;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  salvarNovoLivro() {
    if (!this.selectedFile) {
      alert('A imagem de capa é obrigatória!');
      return;
    }
    this.bookService.criar(this.novoLivro, this.selectedFile).subscribe({
      next: () => {
        alert('Livro cadastrado com sucesso!');
        this.fecharModal();
        this.carregarLivros(); // Atualiza a lista automaticamente
        this.novoLivro = { name: '', author: '', description: '', releaseYear: 2026 };
      },
      error: () => alert('Erro ao registrar livro.')
    });
  }

  ordenar(tipo: string) {
    if (tipo === 'AZ') {
      this.livros.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      this.livros.sort((a, b) => b.name.localeCompare(a.name));
    }
  }

  deletarLivro(id: number) {
    if (confirm('Deseja excluir este livro permanentemente?')) {
      this.bookService.deletar(id).subscribe({
        next: () => this.carregarLivros(),
        error: () => alert('Erro ao deletar.')
      });
    }
  }

  verDetalhes(id: number) {
    this.router.navigate(['/livro', id]);
  }
}
