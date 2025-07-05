# Documentação da API

## Endpoints

### Autenticação
- **POST /login**
  - **Descrição**: Realiza o login do usuário.
  - **Parâmetros**: 
    - `body`: `{ username: string, password: string }`
  - **Resposta**: 
    - `200 OK`: `{ token: string }`
    - `401 Unauthorized`: `{ error: "Invalid credentials" }`

### Usuários
- **GET /usuarios**
  - **Descrição**: Retorna uma lista de todos os usuários.
  - **Resposta**: 
    - `200 OK`: `[{ id: number, nome: string, ... }]`

- **POST /usuarios**
  - **Descrição**: Cria um novo usuário.
  - **Parâmetros**:
    - `body`: `{ nome: string, email: string, senha: string }`
  - **Resposta**:
    - `201 Created`: `{ id: number, nome: string, ... }`

- **GET /usuarios/:id**
  - **Descrição**: Retorna detalhes de um usuário específico.
  - **Parâmetros**:
    - `path`: `:id` (ID do usuário)
  - **Resposta**:
    - `200 OK`: `{ id: number, nome: string, ... }`
    - `404 Not Found`: `{ error: "User not found" }`

- **PUT /usuarios/:id**
  - **Descrição**: Atualiza um usuário específico.
  - **Parâmetros**:
    - `path`: `:id` (ID do usuário)
    - `body`: `{ nome: string, email: string }`
  - **Resposta**:
    - `200 OK`: `{ id: number, nome: string, ... }`
    - `404 Not Found`: `{ error: "User not found" }`

- **DELETE /usuarios/:id**
  - **Descrição**: Exclui um usuário específico.
  - **Parâmetros**:
    - `path`: `:id` (ID do usuário)
  - **Resposta**:
    - `200 OK`: `{ message: "User deleted" }`
    - `404 Not Found`: `{ error: "User not found" }`

### Praticantes
- **GET /praticantes**
  - **Descrição**: Lista todos os praticantes cadastrados.
  - **Resposta**: 
    - `200 OK`: `[{ id: number, nome: string, ... }]`

- **POST /praticantes**
  - **Descrição**: Cria um novo praticante.
  - **Parâmetros**:
    - `body`: `{ nome: string, data_nascimento: string, ... }`
  - **Resposta**:
    - `201 Created`: `{ id: number, nome: string, ... }`

- **GET /praticantes/:id**
  - **Descrição**: Retorna os detalhes de um praticante específico.
  - **Parâmetros**:
    - `path`: `:id` (ID do praticante)
  - **Resposta**:
    - `200 OK`: `{ id: number, nome: string, ... }`
    - `404 Not Found`: `{ error: "Praticante not found" }`

- **PUT /praticantes/:id**
  - **Descrição**: Atualiza um praticante específico.
  - **Parâmetros**:
    - `path`: `:id` (ID do praticante)
    - `body`: `{ nome: string, data_nascimento: string, ... }`
  - **Resposta**:
    - `200 OK`: `{ id: number, nome: string, ... }`
    - `404 Not Found`: `{ error: "Praticante not found" }`

- **DELETE /praticantes/:id**
  - **Descrição**: Exclui um praticante específico.
  - **Parâmetros**:
    - `path`: `:id` (ID do praticante)
  - **Resposta**:
    - `200 OK`: `{ message: "Praticante deleted" }`
    - `404 Not Found`: `{ error: "Praticante not found" }`

### Sessões
- **GET /sessoes**
  - **Descrição**: Lista todas as sessões disponíveis.
  - **Resposta**: 
    - `200 OK`: `[{ id: number, data: string, ... }]`

- **POST /sessoes**
  - **Descrição**: Cria uma nova sessão.
  - **Parâmetros**:
    - `body`: `{ data: string, descricao: string, ... }`
  - **Resposta**:
    - `201 Created`: `{ id: number, data: string, ... }`

- **GET /sessoes/:id**
  - **Descrição**: Retorna detalhes de uma sessão específica.
  - **Parâmetros**:
    - `path`: `:id` (ID da sessão)
  - **Resposta**:
    - `200 OK`: `{ id: number, data: string, ... }`
    - `404 Not Found`: `{ error: "Session not found" }`

- **PUT /sessoes/:id**
  - **Descrição**: Atualiza uma sessão específica.
  - **Parâmetros**:
    - `path`: `:id` (ID da sessão)
    - `body`: `{ data: string, descricao: string, ... }`
  - **Resposta**:
    - `200 OK`: `{ id: number, data: string, ... }`
    - `404 Not Found`: `{ error: "Session not found" }`

- **DELETE /sessoes/:id**
  - **Descrição**: Exclui uma sessão específica.
  - **Parâmetros**:
    - `path`: `:id` (ID da sessão)
  - **Resposta**:
    - `200 OK`: `{ message: "Session deleted" }`
    - `404 Not Found`: `{ error: "Session not found" }`

---

### **USAGE.md** (Instruções de Uso)

```markdown
# Instruções de Uso

## Requisitos
- Node.js v20.14.0 ou superior
- Banco de dados configurado (PostgreSQL)

## Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/angelxDk/EquoServ


## Navegue até o diretório do projeto:

1. cd EquoServ
2. Instale as dependências:
npm install


## Executando a API
1. Configure as variáveis de ambiente conforme o arquivo .env.example. caso tiver.

2. Inicie o servidor:
npm start
3. Acesse a API através de http://localhost:3334.

## Testando Endpoints
Use ferramentas como Postman ou Insomnia para testar os endpoints da API.

## Exemplo de Requisição
Para testar o login: 

curl -X POST http://localhost:3334/login -d '{"username":"user","password":"pass"}'