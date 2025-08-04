# Desafio TAGME

# 📸 TAGME - Plataforma de Gerenciamento de Imagens

Uma aplicação full-stack moderna para upload, organização e visualização de imagens com autenticação segura.

## 🚀 Tecnologias

### Backend

- **NestJS** - Framework Node.js progressivo
- **MongoDB** - Banco de dados NoSQL
- **JWT** - Autenticação segura
- **Sharp** - Processamento de imagens
- **Swagger** - Documentação da API

### Frontend

- **Angular 20** - Framework frontend moderno
- **Angular Material** - UI/UX components
- **ngx-image-cropper** - Edição de imagens
- **TypeScript** - Linguagem tipada

## 🎯 Funcionalidades

- ✅ **Autenticação completa** (registro, login, logout)
- ✅ **Upload de imagens** com crop automático
- ✅ **Galeria responsiva** com paginação
- ✅ **Filtros e ordenação** por título e data
- ✅ **Preview em tempo real** das imagens
- ✅ **Proteção de rotas** com guards
- ✅ **API REST documentada** com Swagger

## 🐳 Executando com Docker

### Pré-requisitos

- Docker
- Docker Compose

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/Desafio-TAGME.git
cd Desafio-TAGME
```

### 2. Execute toda a aplicação

```bash
docker-compose up -d
```

### 3. Acesse as aplicações

- **Frontend**: <http://localhost:4200>
- **Backend**: <http://localhost:3000>
- **API Docs**: <http://localhost:3000/api/docs>
- **MongoDB**: localhost:27017

## 🧪 Executando Testes

### Testes do Backend

```bash
docker-compose run backend-test
```

### Testes do Frontend

```bash
docker-compose run frontend-test
```

## 📱 Como Usar

1. **Acesse** <http://localhost:4200>
2. **Crie uma conta** ou faça login
3. **Envie imagens** usando o botão "Enviar Imagem"
4. **Edite** a imagem com a ferramenta de crop
5. **Organize** suas imagens com filtros e ordenação
6. **Visualize** suas imagens na galeria

## 🏗️ Estrutura do Projeto

```
📦 Desafio-TAGME
├── 🎨 frontend/          # Angular Application
│   ├── src/app/
│   │   ├── auth/         # Autenticação
│   │   ├── images/       # Gerenciamento de imagens
│   │   └── home/         # Página inicial
├── ⚙️ backend/           # NestJS API
│   ├── src/
│   │   ├── auth/         # Estratégias JWT
│   │   ├── user/         # Usuários
│   │   └── image/        # Imagens
└── 🐳 docker-compose.yml # Orquestração
```

## 🔧 Desenvolvimento Local

### Backend

```bash
cd backend
npm install
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
ng serve
```

## 📋 Variáveis de Ambiente

Copie os arquivos `.env.example` para `.env` e configure:

**Backend**:

```env
MONGODB_URI=mongodb://localhost:27017/tagme
JWT_SECRET=seu_jwt_secret_aqui
```

## 🛡️ Segurança

- 🔐 Autenticação JWT com expiração
- 🚫 Proteção CORS configurada
- 🔒 Validação de dados com class-validator
- 👤 Isolamento de dados por usuário

## 🚀 Deploy

A aplicação está containerizada e pronta para deploy em qualquer ambiente que suporte Docker.

---

Desenvolvido para o Desafio da TAGME.
