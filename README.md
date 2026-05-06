# Library API

API backend para gerenciamento de biblioteca, com autenticacao JWT, controle de usuarios/perfis e CRUD de livros com upload de imagem.

## Nome do projeto
**Library API**
(artifact atual no Maven: `Library`)

## Descricao
Este projeto e uma API REST em Java com Spring Boot que oferece:

- autenticacao via JWT;
- gerenciamento de usuarios e perfis;
- gerenciamento de livros;
- upload e exposicao de imagens dos livros;
- documentacao interativa via Swagger/OpenAPI.

## Tecnologias utilizadas

- Java 17
- Spring Boot 3.2.5
- Spring Web
- Spring Data JPA
- Spring Security
- JWT (`java-jwt`)
- MySQL
- Springdoc OpenAPI (Swagger UI)
- Lombok
- Maven

## Estrutura de componentes

- **Controllers**
  - `AuthenticationController` (login)
  - `UserController` (usuarios)
  - `ProfileController` (perfis)
  - `BookController` (livros)
- **AppService**
  - `AuthenticationAppService`
  - `UserAppService`
  - `ProfileAppService`
  - `BookAppService`
- **Domain/Entities**
  - `User`
  - `Profile`
  - `Book`
- **Repository**
  - `UserRepository`
  - `ProfileRepository`
  - `BookRepository`
- **Infra**
  - JWT: `SecurityConfigurations`, `SecurityFilter`, `TokenService`, `OpenAPIConfig`
  - Config: `WebConfig`, `CustomAuthenticationEntryPoint`, `Error`
- **DTO**
  - `AuthenticationDTO`, `UserAddDTO`, `UserListDTO`, `UserProfileDTO`, `BookAddDTO`

## Pre-requisitos

- Java 17+
- Maven 3.8+
- MySQL em execucao
- Banco de dados `Library` criado

## Configuracao

Ajuste o arquivo `src/main/resources/application.properties` conforme seu ambiente:

- `spring.datasource.url`
- `spring.datasource.username`
- `spring.datasource.password`
- `path.documents`
- `logging.file.name`

> Importante: o projeto usa caminhos absolutos no Windows para logs e imagens.

## Como rodar

### 1) Clonar o repositorio
```bash
git clone <url-do-repositorio>
cd Library_Production
```

### 2) Configurar banco MySQL
Crie o banco:
```sql
CREATE DATABASE Library;

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

CREATE TABLE Profile (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(50) NOT NULL,
    Creation_Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    Is_Active BOOLEAN DEFAULT TRUE
);

Select * FROM  Profile
Select * FROM User

DROP TABLE Profile;
```

### 3) Executar a aplicacao
```bash
mvn spring-boot:run
```

A API sobe por padrao em:
- `http://localhost:8080`

## Dados iniciais (seed)

Ao iniciar, a aplicacao cria automaticamente (se nao existirem):

- perfis: `Administrator` e `User`;
- usuario admin:
  - username: `admin`
  - password: `1234`

## Autenticacao

A autenticacao e feita por JWT.

1. Faca login em `POST /api/authentication/login`;
2. Copie o token retornado em `accessToken`;
3. Envie no header das demais rotas:
   - `Authorization: Bearer <token>`

## Endpoints

### Autenticacao
- `POST /api/authentication/login`
  Realiza login e retorna token JWT.

Exemplo de body:
```json
{
  "username": "admin",
  "password": "1234"
}
```

### Usuarios (`/api/users`)
- `GET /api/users`
  Lista usuarios.
- `GET /api/users/profile/me`
  Retorna perfil do usuario autenticado.
- `POST /api/users`
  Cria usuario.
- `PUT /api/users/{id}`
  Atualiza usuario.
- `DELETE /api/users/{id}`
  Remove usuario.

Exemplo de criacao:
```json
{
  "username": "novo.usuario",
  "password": "1234",
  "name": "Novo Usuario"
}
```

### Perfis (`/api/profiles`)
- `GET /api/profiles`
  Lista todos os perfis.

### Livros (`/api/books`)
- `GET /api/books`
  Lista livros.
- `POST /api/books` (multipart/form-data)
  Cadastra livro com imagem.
- `PUT /api/books/{id}` (multipart/form-data)
  Atualiza livro e, opcionalmente, imagem.
- `DELETE /api/books/{id}`
  Remove livro e imagem associada.

#### Formato esperado no multipart de livros
- `bookDto`: JSON em string com:
  - `name`
  - `description`
  - `author`
  - `releaseYear`
- `image`: arquivo da imagem

## Upload e acesso de imagens

- Diretorio fisico de upload: `C:/Users/kaua.moraes/Desktop/Library/imagens/`
- URL publica mapeada: `/uploads/**`
- Exemplo de URL gerada para imagem:
  - `http://localhost:8080/uploads/<arquivo>`

## Documentacao da API (Swagger)

Apos subir a aplicacao, acesse:

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## Logs

Os logs sao gravados em:
- `C:/Users/kaua.moraes/Desktop/Library/Log/library_api.log`

Com rotacao configurada para:
- 10MB por arquivo;
- historico de 7 dias.

## Tratamento de erros

- Login invalido retorna `401 Unauthorized`.
- Requisicoes sem autenticacao em rotas protegidas retornam JSON customizado com mensagem de acesso negado.

## Melhorias recomendadas

- Trocar `NoOpPasswordEncoder` por `BCryptPasswordEncoder`;
- Externalizar segredo JWT para variavel de ambiente;
- Remover credenciais sensiveis do `application.properties`;
- Adicionar testes automatizados (unitarios e integracao);
- Definir regras explicitas de autorizacao por rota no `SecurityFilterChain`.

## Licenca

Defina aqui a licenca do projeto (ex.: MIT).
