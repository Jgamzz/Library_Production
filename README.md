# 📚 Library Production

Sistema de gerenciamento de biblioteca desenvolvido com Angular 19, permitindo autenticação de usuários, gerenciamento de livros e controle de acesso administrativo.

---

## 🚀 Tecnologias Utilizadas

### Frontend
- Angular 19
- TypeScript
- RxJS
- Angular Router
- Angular Forms
- HTML5
- CSS3

### Integração
- REST API
- JWT Authentication
- HttpClient

---

## ✨ Funcionalidades

### 🔐 Autenticação
- Login de usuários
- Armazenamento de token JWT
- Controle de sessão
- Logout seguro

### 👤 Cadastro
- Cadastro de novos usuários
- Integração com API de usuários

### 📚 Livros
- Listagem de livros
- Visualização de detalhes
- Cadastro de livros
- Atualização de informações
- Exclusão de livros

### 🛠 Administração
- Área administrativa para gerenciamento do acervo
- Controle de permissões baseado em perfil

---

## 📂 Estrutura do Projeto

```text
src/
├── app/
│   ├── core/
│   │   ├── models/
│   │   └── services/
│   │       ├── auth.service.ts
│   │       ├── book.service.ts
│   │       └── user.service.ts
│   │
│   ├── views/
│   │   ├── login/
│   │   ├── cadastro/
│   │   ├── principal/
│   │   ├── detalhe-livro/
│   │   └── gerenciamento-livro/
│   │
│   ├── app.routes.ts
│   └── app.config.ts
│
└── assets/
```

---

## 🗺 Rotas da Aplicação

| Rota | Descrição |
|--------|------------|
| `/login` | Tela de login |
| `/cadastro` | Cadastro de usuários |
| `/principal` | Página principal |
| `/livro/:id` | Detalhes do livro |
| `/admin/livros` | Gerenciamento de livros |

---

## ⚙️ Instalação

### 1. Clonar o repositório

```bash
git clone git@github.com:Jgamzz/Library_Production.git
```

### 2. Acessar o projeto

```bash
cd frontend
```

### 3. Instalar dependências

```bash
npm install
```

### 4. Executar aplicação

```bash
ng serve
```

ou

```bash
npm start
```

---

## 🌐 Acesso

Após iniciar o servidor:

```text
http://localhost:4200
```

---

## 🔑 Autenticação

A aplicação utiliza:

- JWT (JSON Web Token)
- Header Authorization Bearer Token
- Controle de perfil de usuário
- Permissões administrativas

Exemplo:

```http
Authorization: Bearer eyJhbGciOi...
```

---

## 🔄 Comunicação com API

Endpoints utilizados:

### Autenticação

```http
POST /api/authentication/login
```

### Usuários

```http
POST /api/users
GET /api/users/profile/me
```

### Livros

```http
GET    /api/books
GET    /api/books/{id}
POST   /api/books
PUT    /api/books/{id}
DELETE /api/books/{id}
```

---

## 📸 Telas

### Login
- Autenticação do usuário

### Cadastro
- Registro de novos usuários

### Página Principal
- Visualização do acervo

### Detalhes do Livro
- Informações completas do livro

### Administração
- Cadastro e gerenciamento de livros

---

## 🧪 Executando Testes

```bash
ng test
```

---

## 📦 Build para Produção

```bash
ng build
```

Arquivos gerados:

```text
dist/
```

---

## 🔮 Melhorias Futuras

- [ ] Recuperação de senha
- [ ] Upload avançado de imagens
- [ ] Filtro e busca de livros
- [ ] Dashboard administrativo
- [ ] Histórico de empréstimos
- [ ] Responsividade mobile

---

## 👨‍💻 Desenvolvedor

**Kauã Teixeira Moraes**

GitHub:

🔗 https://github.com/Jgamzz

---

## 📄 Licença

Projeto desenvolvido para fins acadêmicos e de aprendizado.
