import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-box">
        <h2>Biblioteca - Login</h2>
        <form (ngSubmit)="onLogin()">
          <div class="input-group">
            <label>Username</label>
            <input type="text" [(ngModel)]="credenciais.username" name="username" required placeholder="Digite seu usuário">
          </div>
          <div class="input-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="credenciais.password" name="password" required placeholder="Digite sua senha">
          </div>
          <button type="submit">Entrar</button>
        </form>
        <p>Não tem conta? <a routerLink="/cadastro">Cadastre-se aqui</a></p>
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
    button { width: 100%; padding: 12px; background: #007bff; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; font-weight: bold; }
    button:hover { background: #0056b3; }
    p { margin-top: 20px; text-align: center; font-size: 14px; }
    a { color: #007bff; text-decoration: none; font-weight: bold; }
    a:hover { text-decoration: underline; }
  `]
})
export class LoginComponent {
  credenciais = { username: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.credenciais).subscribe({
      next: () => {
        this.router.navigate(['/principal']);
      },
      error: () => alert('Usuário ou senha inválidos. Verifique as credenciais.')
    });
  }
}
