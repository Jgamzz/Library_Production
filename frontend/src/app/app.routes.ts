import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./views/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./views/cadastro/cadastro.component').then(c => c.CadastroComponent)
  },
  {
    path: 'principal',
    loadComponent: () => import('./views/principal/principal.component').then(c => c.PrincipalComponent)
  },
  {
    path: 'admin/livros',
    loadComponent: () => import('./views/gerenciamento-livro/gerenciamento-livro.component').then(c => c.GerenciamentoLivroComponent)
  },
  {
    path: 'livro/:id',
    loadComponent: () => import('./views/detalhe-livro/detalhe-livro.component').then(c => c.DetalheLivroComponent)
  }
];
