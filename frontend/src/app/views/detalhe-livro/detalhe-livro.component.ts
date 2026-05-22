import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookService } from '../../core/services/book.service';

@Component({
  selector: 'app-detalhe-livro',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
          <button routerLink="/principal" class="back-btn">Voltar à Página Principal</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f4f4f4; padding: 20px; font-family: Arial, sans-serif; }
    .detail-card { background: white; max-width: 850px; width: 100%; display: flex; gap: 40px; padding: 35px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
    .detail-card img { width: 300px; height: 450px; object-fit: cover; border-radius: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.15); }
    .info-panel { flex: 1; display: flex; flex-direction: column; }
    h2 { margin-top: 0; color: #2c3e50; font-size: 28px; }
    .author { color: #7f8c8d; margin: 5px 0 15px 0; font-size: 18px; font-weight: normal; }
    .year { font-size: 14px; font-weight: bold; color: #333; }
    hr { border: 0; border-top: 1px solid #eee; margin: 20px 0; }
    h3 { color: #2c3e50; margin-bottom: 10px; }
    .description { line-height: 1.7; color: #555; text-align: justify; margin-bottom: 30px; white-space: pre-line; }
    .back-btn { margin-top: auto; padding: 12px; background: #34495e; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 15px; font-weight: bold; transition: 0.2s; }
    .back-btn:hover { background: #2c3e50; }
  `]
})
export class DetalheLivroComponent implements OnInit {
  livro: any = null;

  constructor(private route: ActivatedRoute, private bookService: BookService, private router: Router) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.bookService.listar().subscribe(livros => {
      this.livro = livros.find(l => l.id === id);
      if (!this.livro) {
        alert('Este livro não foi localizado em nossa base de dados.');
        this.router.navigate(['/principal']);
      }
    });
  }
}
