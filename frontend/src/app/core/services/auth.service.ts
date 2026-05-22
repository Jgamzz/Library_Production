import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  login(dados: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/authentication/login`, dados).pipe(
      tap(res => {
        if (res && res.accessToken) {
          localStorage.setItem('token', res.accessToken);
          this.salvarDadosPerfil(res.accessToken);
        }
      })
    );
  }

  cadastro(dados: any): Observable<any> {
    // Envia os dados para o seu UserController @PostMapping
    return this.http.post<any>(`${this.apiUrl}/users`, dados);
  }

  private salvarDadosPerfil(token: string) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      localStorage.setItem('userId', payload.id);

      // Consome o seu endpoint /api/users/profile/me para identificar o perfil
      this.http.get<any>(`${this.apiUrl}/users/profile/me`, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: (profile) => {
          localStorage.setItem('profileName', profile.name); // Salva se é "ADMIN" ou "USER"
        },
        error: (err) => console.error('Erro ao buscar perfil detalhado', err)
      });
    } catch (e) {
      console.error('Erro ao decodificar o token JWT', e);
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
    window.location.reload();
  }
}
