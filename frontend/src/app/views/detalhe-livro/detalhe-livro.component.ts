import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../core/services/book.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-detalhe-livro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="detail-container" *ngIf="livro">
      <div class="detail-card">
        <img [src]="livro.image ? livro.image : 'https://via.placeholder.com/300x450?text=Sem+Capa'" alt="Capa">
        
        <div class="info-panel">
          <h2>{{ livro.name }}</h2>
          <h4 class="author">Autor: {{ livro.author }}</h4>
          <p class="year">Ano de Publicação: {{ livro.releaseYear }}</p>
          <hr>
          <h3>Biografia do Livro</h3>
          <p class="description">{{ livro.description }}</p>
          
          <div class="action-row">
            <button routerLink="/principal" class="back-btn">Voltar à Página Principal</button>
            
            <button *ngIf="isAdmin" (click)="abrirModalEdicao()" class="edit-btn">Editar Informações</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-overlay" *ngIf="exibirModal">
      <div class="modal-card">
        <div class="modal-header">
          <h2>Atualizar Cadastro do Livro</h2>
          <button class="btn-close" (click)="fecharModalEdicao()">&times;</button>
        </div>
        
        <form (ngSubmit)="atualizarLivro()" class="modal-form">
          <div class="form-group">
            <label>Nome do Livro</label>
            <input type="text" [(ngModel)]="livroEdicao.name" name="name" required>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Autor</label>
              <input type="text" [(ngModel)]="livroEdicao.author" name="author" required>
            </div>
            <div class="form-group">
              <label>Ano Lançamento</label>
              <input type="number" [(ngModel)]="livroEdicao.releaseYear" name="releaseYear" required>
            </div>
          </div>

          <div class="form-group">
            <label>Descrição / Biografia</label>
            <textarea [(ngModel)]="livroEdicao.description" name="description" rows="4" required></textarea>
          </div>

          <div class="form-group">
            <label>Nova Capa do Livro (Opcional - multipart/form-data)</label>
            <div class="file-drop-area">
              <input type="file" (change)="onFileSelected($event)">
              <p>Selecione um arquivo de imagem binária se desejar alterar a capa</p>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-modal-cancel" (click)="fecharModalEdicao()">Cancelar</button>
            <button type="submit" class="btn-modal-save">Salvar Alterações (PUT)</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .detail-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #F8F9FA; padding: 20px; font-family: 'Segoe UI', Tahoma, sans-serif; }
    .detail-card { background: white; max-width: 850px; width: 100%; display: flex; gap: 40px; padding: 35px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); border: 1px solid #E0E0E0; }
    .detail-card img { width: 300px; height: 450px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.08); }
    .info-panel { flex: 1; display: flex; flex-direction: column; }
    h2 { margin-top: 0; color: #2c3e50; font-size: 28px; font-weight: 700; }
    .author { color: #7f8c8d; margin: 5px 0 15px 0; font-size: 18px; font-weight: normal; }
    .year { font-size: 14px; font-weight: bold; color: #039BE5; }
    hr { border: 0; border-top: 1px solid #eee; margin: 20px 0; }
    h3 { color: #2c3e50; margin-bottom: 10px; font-weight: 600; }
    .description {  padding-left: 2px; ;  padding-right: 2px; overflow: auto;
    max-height: 200px; line-height: 1.7; color: #555; text-align: justify; margin-bottom: 30px; white-space: pre-line; flex-grow: 1; }
    
    .action-row { display: flex; gap: 15px; margin-top: auto; }
    .back-btn { padding: 12px 20px; background: #34495e; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: bold; transition: 0.2s; }
    .back-btn:hover { background: #2c3e50; }
    .edit-btn { padding: 12px 25px; background: #039BE5; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: bold; transition: 0.2s; box-shadow: 0 2px 6px rgba(3, 155, 229, 0.2); }
    .edit-btn:hover { background: #0288D1; }

    /* ESTILIZAÇÃO CLEAN & BABY BLUE DO MODAL */
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); display: flex; justify-content: center; align-items: center; z-index: 2000; }
    .modal-card { background: #FFFFFF; width: 100%; max-width: 520px; border-radius: 14px; padding: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.08); border: 1px solid #B3E5FC; box-sizing: border-box; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #E1F5FE; padding-bottom: 12px; }
    .modal-header h2 { color: #2C3E50; font-size: 18px; margin: 0; font-weight: 700; }
    .btn-close { background: none; border: none; font-size: 26px; cursor: pointer; color: #9E9E9E; }
    
    .modal-form { display: flex; flex-direction: column; gap: 15px; text-align: left; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group label { font-weight: 600; color: #2C3E50; font-size: 13px; }
    .form-group input, .form-group textarea { padding: 11px; border: 1px solid #E0E0E0; border-radius: 8px; background: #FAFAFA; font-family: inherit; font-size: 14px; box-sizing: border-box; }
    .form-group input:focus, .form-group textarea:focus { border-color: #B3E5FC; background: #FFFFFF; outline: none; }
    
    .file-drop-area { border: 2px dashed #B3E5FC; padding: 15px; text-align: center; border-radius: 8px; background: #FBFDFF; }
    .file-drop-area p { margin: 6px 0 0 0; font-size: 12px; color: #757575; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 15px; border-top: 1px solid #F0F4F8; padding-top: 15px; }
    .btn-modal-cancel { background: #F5F5F5; color: #616161; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; }
    .btn-modal-save { background: #039BE5; color: white; border: none; padding: 10px 25px; border-radius: 8px; cursor: pointer; font-weight: bold; }
  `]
})
export class DetalheLivroComponent implements OnInit {
  livro: any = null;
  livroEdicao: any = { name: '', author: '', description: '', releaseYear: 2026 };
  isAdmin = false;
  exibirModal = false;
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.carregarInformacoesDoLivro(id);
  }

  carregarInformacoesDoLivro(id: number) {
    this.bookService.listar().subscribe({
      next: (livros: any[]) => {
        this.livro = livros.find(l => l.id === id);
        if (!this.livro) {
          alert('Este livro não foi localizado em nossa base de dados.');
          this.router.navigate(['/principal']);
        } else {
          // Instancia o clone com os valores originais para o formulário
          this.livroEdicao = { ...this.livro };
        }
      },
      error: () => {
        alert('Erro de comunicação com o servidor ao buscar acervo.');
        this.router.navigate(['/principal']);
      }
    });
  }

  abrirModalEdicao() {
    this.exibirModal = true;
  }

  fecharModalEdicao() {
    this.exibirModal = false;
    this.selectedFile = null;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  atualizarLivro() {
    // Dispara a alteração chamando o método 'atualizar' do BookService mapeado no Swagger (PUT)
    this.bookService.atualizar(this.livro.id, this.livroEdicao, this.selectedFile || new File([], "")).subscribe({
      next: () => {
        alert('Livro atualizado com sucesso no banco MySQL!');
        this.fecharModalEdicao();
        this.carregarInformacoesDoLivro(this.livro.id); // Sincroniza a tela com os novos dados salvos
      },
      error: () => {
        alert('Erro ao tentar atualizar as propriedades do livro.');
      }
    });
  }
}