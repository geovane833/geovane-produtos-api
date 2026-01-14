# Geovane Produtos API

API para gerenciamento de produtos e categorias, desenvolvida com NestJS, TypeScript, PostgreSQL e Prisma.

## Descrição

Esta API permite cadastrar, editar, listar produtos e categorias. Foi projetada para ser integrada a um sistema de PDV (Ponto de Venda), facilitando a busca de produtos por nome ou código de barras.

## 🏗️ Arquitetura Clean Architecture

A aplicação segue os princípios da **Clean Architecture**, com camadas bem definidas:

```
📱 Frontend → 🖥️ Controller → 🔧 Service → 🎯 Use Case → 🗄️ Repository → 🐘 PostgreSQL
```

### Camadas Implementadas:

- **🏗️ Repository**: Acesso direto ao banco de dados via Prisma
- **🎯 Use Cases**: Regras de negócio específicas para cada operação
- **🔧 Service**: Coordenação entre casos de uso e controladores
- **🖥️ Controller**: Interface HTTP da API REST
- **📱 Frontend**: Interface web responsiva para interação

## Funcionalidades

### 🏷️ Categorias
- ✅ **CRUD Completo**: Criar, listar, editar e excluir categorias
- ✅ **Edição Modal**: Interface bonita para editar nomes de categorias
- ✅ **Validação**: Impede nomes duplicados e campos vazios
- ✅ **Confirmação de Exclusão**: Modal de confirmação para evitar exclusões acidentais

### 📦 Produtos
- ✅ **CRUD Completo**: Criar, listar, editar e excluir produtos
- ✅ **Campos Completos**: Nome, código de barras, imagem, descrição, observação, categoria
- ✅ **Campo Descrição**: Campo dedicado para descrição detalhada do produto
- ✅ **Upload de Imagem**: Suporte a imagens em base64
- ✅ **Validações**: Campos obrigatórios e formatação automática

### 🔍 Sistema de Busca
- ✅ **Busca por EAN**: Busca instantânea por código de barras (similar ao eanpictures.com.br)
- ✅ **Busca por Nome**: Buscar produtos por nome parcial
- ✅ **Interface Destacada**: Seção especial para busca por EAN com gradiente

### 🎨 Interface Web Moderna
- ✅ **Interface Responsiva**: Adapta-se a desktop e mobile
- ✅ **Modais Bonitos**: Sistema de modais no centro da tela com animações
- ✅ **Notificações Flutuantes Premium**: Toast notifications no canto superior direito com:
  - Barra de progresso animada
  - Z-index máximo (acima de tudo)
  - Até 5 notificações simultâneas
  - Fechamento manual com botão X ou clique
  - Animações de entrada/saída suaves
  - Auto-fechamento inteligente por tipo
- ✅ **Sistema de Feedback Visual**: Ícones expressivos, cores temáticas e animações
- ✅ **Tabelas Organizadas**: Listagem de produtos e categorias em formato tabular
- ✅ **Filtros Inteligentes**: Filtrar produtos por categoria em tempo real
- ✅ **Dashboard com Estatísticas**: Cards mostrando totais e métricas
- ✅ **Abas Organizadas**: Produtos, Categorias e Busca por EAN
- ✅ **Nomes em Maiúsculo**: Conversão automática para padronização

### 🛡️ Validações e Segurança
- ✅ **Validação de Dados**: DTOs com class-validator
- ✅ **Tratamento de Erros**: Respostas HTTP adequadas (400, 404, 500)
- ✅ **Confirmações**: Modais para ações críticas
- ✅ **Limpeza de Dados**: Trim e conversão para maiúsculo
- ✅ **Limite de Payload**: Até 10MB para upload de imagens grandes

## Tecnologias

- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT

## Interface Web

A API inclui uma interface web simples para testar e gerenciar produtos e categorias.

**Para acessar a interface:**
1. Inicie a API: `npm run start:dev`
2. Abra no navegador: `http://localhost:3000/index.html`

**Funcionalidades da interface:**
- Cadastrar produtos com upload de imagem
- Buscar produtos por nome
- Listar todos os produtos
- Gerenciar categorias
- Interface responsiva e intuitiva

## 📁 Arquivos de Configuração

- **`database-setup.sql`** - Scripts SQL completos para criar tabelas e operações CRUD
- **`api-examples.http`** - Exemplos completos de requests HTTP para testar a API
- **`CLEAN_ARCHITECTURE.md`** - Documentação detalhada da arquitetura implementada

## 🚀 Como Usar

### 1. Configurar Banco de Dados
```bash
# Execute os scripts SQL do arquivo database-setup.sql
# Ou use o Prisma para criar as tabelas automaticamente
npx prisma db push
```

### 2. Executar Seed (Dados Iniciais)
```bash
npx prisma db seed
```

### 3. Iniciar a API
```bash
npm run dev
```

### 4. Acessar Interfaces
- **Busca por EAN**: `http://localhost:3000/index.html`
- **Cadastro de Produtos**: `http://localhost:3000/cadastro.html`
- **API Base**: `http://localhost:3000`

## 📋 Operações CRUD Disponíveis

### 🏷️ Categorias
- `POST /categorias` - Criar categoria
- `GET /categorias` - Listar categorias
- `GET /categorias/:id` - Buscar categoria por ID
- `PATCH /categorias/:id` - Atualizar categoria
- `DELETE /categorias/:id` - Excluir categoria

### 📦 Produtos
- `POST /produtos` - Criar produto
- `GET /produtos` - Listar produtos
- `GET /produtos?nome=termo` - Buscar por nome
- `GET /produtos/codigo/:ean` - Buscar por código EAN
- `GET /produtos/:id` - Buscar produto por ID
- `PATCH /produtos/:id` - Atualizar produto
- `DELETE /produtos/:id` - Excluir produto

**Nota**: Para criar produtos, use `categoriaId` selecionando de uma categoria existente.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
