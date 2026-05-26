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
            <label for="username">Username</label>
            <input
              type="text"
              id="username"
              [(ngModel)]="credenciais.username"
              name="username"
              required
              placeholder="Digite seu usuário">
          </div>

          <div class="input-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              [(ngModel)]="credenciais.password"
              name="password"
              required
              placeholder="Digite sua senha">
          </div>

          <button type="submit" class="btn-login">Entrar</button>
        </form>

        <div class="auth-footer">
          <p>Não tem conta? <a routerLink="/cadastro">Cadastre-se aqui</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: #F8F9FA;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .auth-box {
      background: #FFFFFF;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
      border: 1px solid #B3E5FC;
      width: 100%;
      max-width: 380px;
    }

    h2 {
      text-align: center;
      color: #2C3E50;
      margin-bottom: 30px;
      font-size: 22px;
      font-weight: 700;
    }

    .input-group {
      margin-bottom: 20px;
    }

    .input-group label {
      display: block;
      margin-bottom: 6px;
      font-weight: 600;
      color: #2C3E50;
      font-size: 14px;
    }

    .input-group input {
      width: 100%;
      padding: 12px;
      border: 1px solid #E0E0E0;
      border-radius: 8px;
      background: #FAFAFA;
      box-sizing: border-box;
      transition: 0.3s;
    }

    .input-group input:focus {
      border-color: #B3E5FC;
      background: #FFFFFF;
      outline: none;
    }

    .btn-login {
      width: 100%;
      padding: 12px;
      background: #039BE5;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      font-weight: bold;
      transition: 0.3s;
      margin-top: 10px;
    }

    .btn-login:hover {
      background: #0288D1;
      transform: translateY(-1px);
    }

    .auth-footer {
      margin-top: 25px;
      text-align: center;
      font-size: 14px;
    }

    .auth-footer a {
      color: #039BE5;
      text-decoration: none;
      font-weight: bold;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }
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
      error: () => {
        alert('Usuário ou senha inválidos. Verifique as credenciais.');
      }
    });
  }
}
