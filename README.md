# 📚 Library Production

Sistema de gerenciamento de biblioteca desenvolvido com **Angular 19**, integrado a uma API REST responsável pela autenticação de usuários, gerenciamento de perfis e controle do acervo de livros.

O projeto foi construído seguindo uma arquitetura moderna baseada em componentes, serviços e comunicação via API REST utilizando autenticação JWT.

---

## 🚀 Tecnologias Utilizadas

### Frontend

* Angular 19
* TypeScript
* RxJS
* Angular Router
* Angular Forms
* HTML5
* CSS3

### Backend

* Java
* Spring Boot
* Spring Data JPA
* Hibernate
* JWT Authentication
* Maven

### Banco de Dados

* MySQL

---

## ✨ Funcionalidades

### 🔐 Autenticação

* Login de usuários
* Geração e validação de Token JWT
* Controle de sessão
* Logout

### 👤 Usuários

* Cadastro de usuários
* Consulta de perfil do usuário logado
* Controle de permissões

### 📚 Livros

* Listagem de livros
* Consulta de detalhes
* Cadastro de livros
* Atualização de livros
* Exclusão de livros

### 🛠 Administração

* Gerenciamento do acervo
* Controle de usuários
* Controle de perfis

---

## 🏗 Arquitetura

```text
Frontend (Angular)
        │
        ▼
REST API (Spring Boot)
        │
        ▼
MySQL Database
```

### Estrutura Frontend

```text
src/
├── app/
│   ├── core/
│   │   ├── models/
│   │   └── services/
│   │       ├── auth.service.ts
│   │       ├── user.service.ts
│   │       └── book.service.ts
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

## 🗄️ Banco de Dados

O sistema utiliza MySQL para persistência dos dados.

### Tabela: Profile

Responsável pelos perfis de acesso do sistema.

```sql
CREATE TABLE Profile (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(50) NOT NULL,
    Creation_Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    Is_Active BOOLEAN DEFAULT TRUE
);
```

### Tabela: User

Responsável pelo cadastro dos usuários da aplicação.

```sql
CREATE TABLE User (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(50) NOT NULL,
    Name VARCHAR(100) NOT NULL,
    Creation_Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    Is_Active BOOLEAN DEFAULT TRUE,
    Profile_ID INT,
    CONSTRAINT FK_UserProfile FOREIGN KEY (Profile_ID)
    REFERENCES Profile(ID) ON DELETE SET NULL
);
```

### Tabela: Book

A tabela de livros **não precisa ser criada manualmente**.

Ela é gerada automaticamente pelo backend através do **Hibernate/JPA**, utilizando as entidades mapeadas na aplicação Spring Boot.

Ao iniciar o backend com a configuração adequada:

```properties
spring.jpa.hibernate.ddl-auto=update
```

o Hibernate cria e atualiza automaticamente a estrutura da tabela de livros no banco de dados.

---

## 🔗 Modelo Relacional

```text
┌─────────────────┐
│     Profile     │
├─────────────────┤
│ PK ID           │
│ Name            │
│ Creation_Date   │
│ Is_Active       │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────▼────────┐
│      User       │
├─────────────────┤
│ PK ID           │
│ Username        │
│ Password        │
│ Name            │
│ Creation_Date   │
│ Is_Active       │
│ FK Profile_ID   │
└─────────────────┘

┌─────────────────┐
│      Book       │
├─────────────────┤
│ Auto Generated  │
│ By Hibernate    │
└─────────────────┘
```

---

## 🌐 Rotas da Aplicação

| Rota          | Descrição               |
| ------------- | ----------------------- |
| /login        | Tela de login           |
| /cadastro     | Cadastro de usuários    |
| /principal    | Página principal        |
| /livro/:id    | Detalhes do livro       |
| /admin/livros | Gerenciamento de livros |

---

## ⚙️ Instalação

### 1. Clonar o repositório

```bash
git clone git@github.com:Jgamzz/Library_Production.git
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Executar aplicação

```bash
ng serve
```

ou

```bash
npm start
```

---

## 🚀 Executando o Backend

Configurar o banco de dados MySQL e iniciar a API Spring Boot:

```bash
mvn clean install
mvn spring-boot:run
```

---

## 🌍 Acesso

Frontend:

```text
http://localhost:4200
```

Backend:

```text
http://localhost:8080
```

---

## 🔑 Autenticação

A aplicação utiliza JWT (JSON Web Token) para autenticação.

Exemplo:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## 🔄 Endpoints Utilizados

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
GET /api/books

GET /api/books/{id}

POST /api/books

PUT /api/books/{id}

DELETE /api/books/{id}
```

---

## 📸 Telas do Sistema

### Login

Permite autenticação dos usuários.

### Cadastro

Permite criação de novos usuários.

### Página Principal

Exibe os livros cadastrados.

### Detalhes do Livro

Visualização completa das informações do livro.

### Gerenciamento de Livros

Área administrativa para cadastro, edição e remoção de livros.

---

## 🧪 Testes

Executar os testes do Angular:

```bash
ng test
```

---

## 📦 Build de Produção

```bash
ng build
```

Arquivos gerados:

```text
dist/
```

---

## 🔮 Melhorias Futuras

* Recuperação de senha
* Dashboard administrativo
* Upload de imagens para livros
* Sistema de empréstimos
* Controle de reservas
* Histórico de movimentações
* Responsividade mobile

---

## 👨‍💻 Desenvolvedor

Kauã Teixeira Moraes

GitHub:
https://github.com/Jgamzz

---

## 📄 Licença

Projeto desenvolvido para fins acadêmicos, aprendizado e demonstração de conhecimentos em Angular, Spring Boot, MySQL e desenvolvimento Full Stack.
