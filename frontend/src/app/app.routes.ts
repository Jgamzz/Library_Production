import { Routes, CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

// Proteção simples: Se não tiver Token no localStorage, joga para a tela de Login
const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  return localStorage.getItem('token') ? true : router.createUrlTree(['/login']);
};

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./views/login/login.component').then(c => c.LoginComponent) },
  { path: 'cadastro', loadComponent: () => import('./views/cadastro/cadastro.component').then(c => c.CadastroComponent) },
  { path: 'principal', loadComponent: () => import('./views/principal/principal.component').then(c => c.PrincipalComponent), canActivate: [authGuard] },
  { path: 'livro/:id', loadComponent: () => import('./views/detalhe-livro/detalhe-livro.component').then(c => c.DetalheLivroComponent), canActivate: [authGuard] }
];
