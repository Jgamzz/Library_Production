import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-box">
        <h2>Criar Conta</h2>
        <form (ngSubmit)="onCadastro()">
          <div class="input-group">
            <label>Nome Completo</label>
            <input type="text" [(ngModel)]="usuario.name" name="name" required placeholder="Seu nome">
          </div>
          <div class="input-group">
            <label>Username (E-mail / Login)</label>
            <input type="text" [(ngModel)]="usuario.username" name="username" required placeholder="Seu login de acesso">
          </div>
          <div class="input-group">
            <label>Senha</label>
            <input type="password" [(ngModel)]="usuario.password" name="password" required placeholder="Sua senha">
          </div>
          <button type="submit">Salvar Registro</button>
        </form>
        <p><a routerLink="/login">Voltar para o Login</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { display: flex; justify-content: center; align-items: center; height: 100vh; background: #f4f4f4; }
    .auth-box { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); width: 100%; max-width: 400px; font-family: Arial, sans-serif; }
    h2 { text-align: center; color: #2c3e50; margin-bottom: 25px; }
    .input-group { margin-bottom: 20px; }
    .input-group label { display: block; margin-bottom: 5px; font-weight: bold; color: #333; }
    .input-group input { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
    button { width: 100%; padding: 12px; background: #28a745; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; font-weight: bold; }
    button:hover { background: #218838; }
    p { margin-top: 20px; text-align: center; font-size: 14px; }
    a { color: #007bff; text-decoration: none; font-weight: bold; }
  `]
})
export class CadastroComponent {
  usuario = { username: '', password: '', name: '' };

  constructor(private authService: AuthService, private router: Router) {}

  onCadastro() {
    this.authService.cadastro(this.usuario).subscribe({
      next: () => {
        alert('Cadastro realizado com sucesso! Agora você pode efetuar o login.');
        this.router.navigate(['/login']);
      },
      error: () => alert('Erro ao salvar usuário. Certifique-se de que o username é único.')
    });
  }
}
