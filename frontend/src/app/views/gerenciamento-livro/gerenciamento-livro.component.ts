import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BookService } from '../../core/services/book.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-gerenciamento-livro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="dashboard">
      <aside class="sidebar">
        <div class="sidebar-header">
          <h3>Library</h3>
        </div>
        <nav class="nav-group">
          <button [routerLink]="['/principal']" class="nav-btn">
            <i class="fa-solid fa-book"></i> Ver Livros
          </button>
          <button [routerLink]="['/admin/livros']" class="nav-btn active">
            <i class="fa-solid fa-plus"></i> Criar Livro
          </button>
        </nav>
        <button (click)="logout()" class="btn-logout">Sair do Sistema</button>
      </aside>

      <main class="main-content">
        <header class="top-header">
          <h1>Painel Administrativo <span class="badge">ADMIN</span></h1>
        </header>

        <div class="content-padding">
          <div class="card-form">
            <div class="card-header">
              <h2>Cadastrar Novo Livro</h2>
              <p class="subtitle">Preencha os atributos JSON e anexe o arquivo binário da capa (Swagger POST /api/books).</p>
            </div>

            <form (ngSubmit)="salvarLivroDoAdmin()" class="swagger-form">
              <div class="form-group">
                <label for="name">name <span class="type-indicator">(string)</span></label>
                <input type="text" id="name" [(ngModel)]="bookDto.name" name="name" placeholder="Ex: Resident Evil: Code Veronica" required>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="author">author <span class="type-indicator">(string)</span></label>
                  <input type="text" id="author" [(ngModel)]="bookDto.author" name="author" placeholder="Ex: S. D. Perry" required>
                </div>

                <div class="form-group">
                  <label for="releaseYear">releaseYear <span class="type-indicator">(integer)</span></label>
                  <input type="number" id="releaseYear" [(ngModel)]="bookDto.releaseYear" name="releaseYear" placeholder="Ex: 2001" required>
                </div>
              </div>

              <div class="form-group">
                <label for="description">description <span class="type-indicator">(string)</span></label>
                <textarea id="description" [(ngModel)]="bookDto.description" name="description" rows="4" placeholder="Digite a sinopse ou descrição do livro..." required></textarea>
              </div>

              <div class="form-group">
                <label for="image">image <span class="type-indicator">(string $binary)</span></label>
                <div class="upload-box">
                  <input type="file" id="image" (change)="onFileSelected($event)" required>
                  <p class="upload-help">Selecione o arquivo de imagem para ser salvo no banco/servidor.</p>
                </div>
              </div>

              <div class="form-actions">
                <button type="button" [routerLink]="['/principal']" class="btn-cancel">Cancelar</button>
                <button type="submit" class="btn-submit">Salvar Registro</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard { display: flex; height: 100vh; background: #F8F9FA; font-family: 'Segoe UI', sans-serif; }

    /* SIDEBAR - Paleta Branco e Azul Bebê */
    .sidebar { width: 260px; background: #FFFFFF; border-right: 1px solid #E0E0E0; display: flex; flex-direction: column; padding: 25px; box-sizing: border-box; }
    .sidebar-header h3 { color: #039BE5; margin-bottom: 30px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; font-size: 18px; }
    .nav-group { flex-grow: 1; }
    .nav-btn { width: 100%; text-align: left; background: none; border: none; padding: 12px 15px; border-radius: 8px; cursor: pointer; color: #2C3E50; margin-bottom: 5px; transition: 0.3s; font-weight: 500; display: flex; align-items: center; gap: 10px; font-size: 14px; text-decoration: none; box-sizing: border-box; }
    .nav-btn:hover { background: #E1F5FE; color: #039BE5; }
    .nav-btn.active { background: #E1F5FE; color: #039BE5; font-weight: bold; }

    .btn-logout { background: #FFEBEE; color: #D32F2F; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.3s; width: 100%; text-align: center; }
    .btn-logout:hover { background: #FFCDD2; }

    /* CONTEÚDO */
    .main-content { flex: 1; overflow-y: auto; display: flex; flex-direction: column; background: #F8F9FA; }
    .top-header { background: #FFFFFF; padding: 20px 40px; border-bottom: 1px solid #E0E0E0; }
    .top-header h1 { font-size: 22px; color: #2C3E50; margin: 0; font-weight: 700; }
    .badge { font-size: 11px; background: #E1F5FE; color: #039BE5; padding: 4px 12px; border-radius: 20px; margin-left: 10px; vertical-align: middle; font-weight: bold; }
    .content-padding { padding: 30px 40px; display: flex; justify-content: center; }

    /* FORM CARD STYLE */
    .card-form { background: #FFFFFF; width: 100%; max-width: 750px; padding: 35px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.02); border: 1px solid #B3E5FC; }
    .card-header { border-bottom: 1px solid #F0F4F8; margin-bottom: 25px; padding-bottom: 15px; }
    .card-header h2 { color: #2C3E50; margin: 0; font-size: 18px; }
    .subtitle { color: #757575; font-size: 13px; margin: 5px 0 0 0; }

    .swagger-form { display: flex; flex-direction: column; gap: 20px; }
    .form-row { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group label { font-weight: 600; color: #2C3E50; font-size: 13px; }
    .type-indicator { color: #039BE5; font-size: 11px; font-weight: normal; }

    .swagger-form input, .swagger-form textarea { padding: 12px; border: 1px solid #E0E0E0; border-radius: 8px; background: #FAFAFA; transition: 0.3s; font-family: inherit; font-size: 14px; box-sizing: border-box; }
    .swagger-form input:focus, .swagger-form textarea:focus { border-color: #B3E5FC; background: #FFFFFF; outline: none; box-shadow: 0 0 0 3px rgba(3, 155, 229, 0.1); }

    .upload-box { border: 2px dashed #B3E5FC; padding: 20px; border-radius: 8px; background: #FBFDFF; text-align: center; }
    .upload-help { font-size: 12px; color: #757575; margin: 8px 0 0 0; }

    .form-actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 10px; border-top: 1px solid #F0F4F8; padding-top: 20px; }
    .btn-cancel { background: #F5F5F5; color: #616161; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; text-decoration: none; font-size: 14px; }
    .btn-cancel:hover { background: #E0E0E0; }

    .btn-submit { background: #039BE5; color: #FFFFFF; border: none; padding: 12px 25px; border-radius: 8px; cursor: pointer; font-weight: bold; transition: 0.3s; font-size: 14px; box-shadow: 0 2px 6px rgba(3, 155, 229, 0.3); }
    .btn-submit:hover { background: #0288D1; transform: translateY(-1px); }
  `]
})
export class GerenciamentoLivroComponent implements OnInit {
  bookDto = { name: '', author: '', description: '', releaseYear: 2026 };
  selectedFile: File | null = null;

  constructor(private bookService: BookService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Segurança extra: se não for admin, é expulso de volta para a listagem
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/principal']);
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  salvarLivroDoAdmin() {
    if (!this.selectedFile) {
      alert('Por favor, anexe o ficheiro binário da capa!');
      return;
    }

    this.bookService.criar(this.bookDto, this.selectedFile).subscribe({
      next: () => {
        alert('Sucesso! Livro gravado na base de dados.');
        this.router.navigate(['/principal']);
      },
      error: () => alert('Erro ao efetuar a requisição Multipart.')
    });
  }

  logout() {
    this.authService.logout();
  }
}
