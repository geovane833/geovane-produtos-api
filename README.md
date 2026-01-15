# API de Produtos - Geovane

Uma API REST para gerenciamento de produtos e categorias, construída com NestJS e Prisma.

## 🚀 Deploy no Render

### Pré-requisitos
1. Conta no [Render](https://render.com)
2. Banco de dados PostgreSQL (recomendado: [Neon](https://neon.tech) ou Render PostgreSQL)

### Passos para Deploy

1. **Fork ou clone este repositório no GitHub**

2. **Crie um banco PostgreSQL:**
   - No Render: Services → PostgreSQL
   - Ou use Neon: https://neon.tech
   - Copie a URL de conexão

3. **No Render, crie um novo Web Service:**
   - Conecte seu repositório GitHub
   - **Runtime:** Node
   - **Build Command:** `npm run build`
   - **Start Command:** `npm run start:render`

4. **Configure as variáveis de ambiente:**
   - `DATABASE_URL`: URL do seu banco PostgreSQL
   - `NODE_ENV`: `production`
   - `PORT`: será definido automaticamente pelo Render

5. **Deploy automático:**
   - O Render irá executar:
     - `npm install` (que roda `npx prisma generate`)
     - `npm run build`
     - `npm run start:render` (que executa migrações e inicia a app)

## 📋 Funcionalidades

### Categorias
- `GET /categorias` - Listar todas as categorias
- `POST /categorias` - Criar nova categoria
- `PUT /categorias/:id` - Atualizar categoria
- `DELETE /categorias/:id` - Deletar categoria

### Produtos
- `GET /produtos` - Listar todos os produtos
- `GET /produtos/:codigoBarras` - Buscar por código de barras
- `GET /produtos/busca/:nome` - Buscar por nome
- `POST /produtos` - Criar novo produto (com upload de imagem)
- `PUT /produtos/:id` - Atualizar produto
- `DELETE /produtos/:id` - Deletar produto

## 🛠️ Tecnologias

- **NestJS** - Framework Node.js
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **TypeScript** - Tipagem estática
- **Express** - Servidor web
- **Render** - Hospedagem

## 📁 Estrutura do Projeto

```
src/
├── modules/
│   ├── categorias/     # Módulo de categorias
│   └── produtos/       # Módulo de produtos
├── shared/
│   └── prisma/         # Serviço Prisma
├── config/             # Configurações
└── app.module.ts      # Módulo principal
```

## 🔧 Desenvolvimento Local

1. **Clone o repositório**
2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o banco de dados:**
   - Crie um arquivo `.env` baseado no `.env.example`
   - Configure a `DATABASE_URL`

4. **Execute as migrações:**
   ```bash
   npx prisma migrate dev
   ```

5. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

## 🌐 Interface Web

A aplicação inclui uma interface web simples em HTML/JavaScript que pode ser acessada em `http://localhost:3000` (ou a URL do Render após deploy).

## 📝 API Examples

Veja o arquivo `api-examples.http` para exemplos de uso da API.
