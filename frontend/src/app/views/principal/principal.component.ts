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
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent implements OnInit {
  livros: any[] = [];
  isAdmin = false;
  
  // Estados para o Modal de Criação (POST)
  exibirModal = false; 
  novoLivro = { name: '', author: '', description: '', releaseYear: 2026 };
  selectedFile: File | null = null;
  
  // 🎯 ADICIONADO: Estados exclusivos para o Modal de Edição (PUT)
  exibirModalEdicao = false;
  livroIdSelecionado: number | null = null;
  livroEdicao = { name: '', author: '', description: '', releaseYear: 2026 };
  selectedFileEdicao: File | null = null;

  perfil: Perfil | undefined;

  constructor(
    private bookService: BookService, 
    public authService: AuthService, 
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.carregarLivros();
    this.carregarPerfil();
  }

  carregarPerfil() {
    this.userService.obter().subscribe({
      next: (items) => {
        this.perfil = items;
        this.isAdmin = this.perfil && this.perfil.name === 'Administrator';
      },
      error: () => console.error('Erro ao buscar perfil.')
    });
  }

  carregarLivros() {
    this.bookService.listar().subscribe({
      next: (dados: any[]) => this.livros = dados,
      error: () => console.error('Erro ao buscar acervo.')
    });
  }

  // --- MÉTODOS DO MODAL DE CADASTRO (POST) ---
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
        this.carregarLivros(); 
        this.novoLivro = { name: '', author: '', description: '', releaseYear: 2026 };
      },
      error: () => alert('Erro ao registrar livro.')
    });
  }

  // --- 🎯 MÉTODOS DO MODAL DE EDIÇÃO (PUT /api/books/{id}) ---
  abrirModalEdicao(livro: any) {
    this.livroIdSelecionado = livro.id;
    // Clona os dados do livro selecionado para não alterar o card antes de salvar
    this.livroEdicao = { 
      name: livro.name, 
      author: livro.author, 
      description: livro.description, 
      releaseYear: livro.releaseYear 
    };
    this.selectedFileEdicao = null;
    this.exibirModalEdicao = true;
  }

  fecharModalEdicao() {
    this.exibirModalEdicao = false;
    this.livroIdSelecionado = null;
    this.selectedFileEdicao = null;
  }

  onFileSelectedEdicao(event: any) {
    this.selectedFileEdicao = event.target.files[0];
  }

  salvarEdicaoLivro() {
    if (this.livroIdSelecionado === null) return;

    // Dispara a API passando o ID do livro, os dados modificados do form e a nova imagem (se houver)
    this.bookService.atualizar(
      this.livroIdSelecionado, 
      this.livroEdicao, 
      this.selectedFileEdicao || new File([], "")
    ).subscribe({
      next: () => {
        alert('Livro atualizado com sucesso!');
        this.fecharModalEdicao();
        this.carregarLivros(); // Sincroniza a listagem na hora
      },
      error: () => alert('Erro ao atualizar dados do livro.')
    });
  }

  // --- OUTRAS AÇÕES ---
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
  fecharQualquerModal() {
    this.exibirModal = false;
    this.exibirModalEdicao = false;
    this.livroIdSelecionado = null;
    this.selectedFile = null;
    this.selectedFileEdicao = null;
  }
}