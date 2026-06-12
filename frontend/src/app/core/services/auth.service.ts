import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api';

  constructor(private http: HttpClient, private router: Router) {}

  login(credenciais: any): Observable<any> {
    return this.http.post<any>(`${`${this.apiUrl}/authentication/login`}`, credenciais).pipe(
      tap(res => {
        if (res && res.accessToken) {
          localStorage.setItem('token', res.accessToken);
          this.decodeAndSaveProfile(res.accessToken);
        }
      })
    );
  }

  // 🎯 O MÉTODO QUE ESTAVA FALTANDO E QUEBROU O SEU COMPILADOR:
  cadastro(dados: any): Observable<any> {
    return this.http.post<any>(`${`${this.apiUrl}/users`}`, dados);
  }

  private decodeAndSaveProfile(token: string) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      localStorage.setItem('userId', payload.id);

      this.http.get<any>(`${`${this.apiUrl}/users/profile/me`}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: (profile) => {
          localStorage.setItem('profileName', profile.name.toUpperCase());
        },
        error: (err) => console.error('Erro ao recuperar perfil do usuário', err)
      });
    } catch (e) {
      console.error('Falha ao decodificar payload do token JWT', e);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAdmin(): boolean {
    const perfil = localStorage.getItem('profileName');
    return perfil === 'ADMIN' || perfil === 'ROLE_ADMIN';
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
}
