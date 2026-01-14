# 🏗️ Arquitetura Clean Architecture - Geovane Produtos API

Este documento explica a implementação da **Clean Architecture** nesta API de produtos.

## 🎯 Visão Geral da Arquitetura

A aplicação segue os princípios da Clean Architecture, separando responsabilidades em camadas independentes:

```
┌─────────────────────────────────────────────────────────────┐
│                    📱 Frontend Layer                        │
│  (HTML/CSS/JavaScript - Interface do Usuário)              │
└─────────────────────────────────────────────────────────────┘
                                 │
                    HTTP Requests/Responses
                                 │
┌─────────────────────────────────────────────────────────────┐
│                 🖥️ Controller Layer                         │
│  (NestJS Controllers - Interface HTTP da API)              │
└─────────────────────────────────────────────────────────────┘
                                 │
                      Business Logic
                                 │
┌─────────────────────────────────────────────────────────────┐
│                  🔧 Service Layer                           │
│  (Coordenação entre Use Cases e Controllers)               │
└─────────────────────────────────────────────────────────────┘
                                 │
                    Use Cases Execution
                                 │
┌─────────────────────────────────────────────────────────────┐
│                  🎯 Use Cases Layer                         │
│  (Regras de negócio específicas e validações)              │
└─────────────────────────────────────────────────────────────┘
                                 │
                     Data Access
                                 │
┌─────────────────────────────────────────────────────────────┐
│                  🗄️ Repository Layer                        │
│  (Acesso ao banco de dados via Prisma)                     │
└─────────────────────────────────────────────────────────────┘
                                 │
                    Database Operations
                                 │
┌─────────────────────────────────────────────────────────────┐
│                  🐘 PostgreSQL                               │
│  (Banco de dados relacional)                                │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Estrutura de Diretórios

```
src/
├── modules/
│   └── produtos/
│       ├── dto/                    # Data Transfer Objects
│       │   ├── create-produto.dto.ts
│       │   └── update-produto.dto.ts
│       ├── entities/               # Entidades de domínio
│       │   └── produto.entity.ts
│       ├── repositories/           # Camada de acesso a dados
│       │   └── produto.repository.ts
│       ├── use-cases/              # Casos de uso (regras de negócio)
│       │   ├── create-produto.use-case.ts
│       │   ├── find-all-produtos.use-case.ts
│       │   ├── find-by-codigo-barras.use-case.ts
│       │   ├── find-by-nome.use-case.ts
│       │   ├── update-produto.use-case.ts
│       │   └── delete-produto.use-case.ts
│       ├── produtos.controller.ts  # Controllers HTTP
│       ├── produtos.service.ts     # Serviços (coordenação)
│       └── produtos.module.ts      # Módulo NestJS
├── shared/
│   └── prisma/
│       └── prisma.service.ts       # Serviço de banco de dados
├── config/                         # Configurações
│   ├── database.ts
│   └── jwt.ts
└── auth/                           # (Removido - sem autenticação)
```

## 🔄 Fluxo de Dados - Exemplo: Criar Produto

### 1. 📱 Frontend (cadastro.html)
```javascript
// Usuário preenche formulário e clica em "Cadastrar"
const produtoData = {
    nome: "Coca-Cola 2L",
    codigoBarras: "7891234567890",
    imagem: "base64_encoded_image...",
    categoriaId: 1
};

// Envia para API
fetch('/produtos', {
    method: 'POST',
    body: JSON.stringify(produtoData)
});
```

### 2. 🖥️ Controller (produtos.controller.ts)
```typescript
@Post()
async create(@Body() createProdutoDto: CreateProdutoDto) {
  // Recebe dados do frontend
  return this.produtosService.create(createProdutoDto);
}
```

### 3. 🔧 Service (produtos.service.ts)
```typescript
async create(createProdutoDto: CreateProdutoDto) {
  // Coordena a execução do caso de uso
  return this.createProdutoUseCase.execute(createProdutoDto);
}
```

### 4. 🎯 Use Case (create-produto.use-case.ts)
```typescript
async execute(createProdutoDto: CreateProdutoDto) {
  // Regras de negócio e validações
  if (!createProdutoDto.nome?.trim()) {
    throw new Error('Nome do produto é obrigatório');
  }

  if (!createProdutoDto.categoriaId) {
    throw new Error('Categoria é obrigatória');
  }

  // Chama o repositório para persistir
  return this.produtoRepository.create(createProdutoDto);
}
```

### 5. 🗄️ Repository (produto.repository.ts)
```typescript
async create(data: CreateProdutoDto) {
  // Converte base64 para Buffer e salva no banco
  return this.prisma.produto.create({
    data: {
      ...data,
      imagem: data.imagem ? Buffer.from(data.imagem, 'base64') : null,
    },
    include: { categoria: true },
  });
}
```

### 6. 🐘 PostgreSQL
```sql
-- Dados são salvos na tabela 'Produto'
INSERT INTO "Produto" (nome, "codigoBarras", imagem, "categoriaId")
VALUES ('Coca-Cola 2L', '7891234567890', <binary_data>, 1);
```

## 📋 Responsabilidades de Cada Camada

### 📱 **Frontend Layer**
- **Responsabilidade**: Interface do usuário e interação
- **Tecnologias**: HTML, CSS, JavaScript
- **Funções**: Formulários, validação client-side, exibição de dados

### 🖥️ **Controller Layer**
- **Responsabilidade**: Interface HTTP da API
- **Tecnologias**: NestJS Controllers
- **Funções**: Receber requests HTTP, validar entrada básica, retornar responses

### 🔧 **Service Layer**
- **Responsabilidade**: Coordenação entre camadas
- **Tecnologias**: NestJS Services
- **Funções**: Orquestrar use cases, gerenciar transações, transformar dados

### 🎯 **Use Cases Layer**
- **Responsabilidade**: Regras de negócio específicas
- **Tecnologias**: Classes TypeScript puras
- **Funções**:
  - Validações de negócio
  - Lógica de aplicação
  - Coordenação entre repositórios

### 🗄️ **Repository Layer**
- **Responsabilidade**: Acesso a dados
- **Tecnologias**: Prisma ORM
- **Funções**:
  - Queries ao banco
  - Transformação de dados
  - Isolamento da infraestrutura

## 🎯 Benefícios da Clean Architecture

### ✅ **Separação de Responsabilidades**
Cada camada tem uma responsabilidade clara e única.

### ✅ **Testabilidade**
Cada camada pode ser testada independentemente.

### ✅ **Manutenibilidade**
Mudanças em uma camada não afetam as outras.

### ✅ **Independência de Frameworks**
Regras de negócio não dependem de frameworks externos.

### ✅ **Facilidade de Testes**
Use cases podem ser testados sem banco de dados.

### ✅ **Escalabilidade**
Novas funcionalidades podem ser adicionadas facilmente.

## 🔧 Como Adicionar Nova Funcionalidade

### Exemplo: Buscar produtos por preço

1. **Repository**: Adicionar método `findByPrecoRange()`
2. **Use Case**: Criar `FindProdutosByPrecoUseCase`
3. **Service**: Adicionar método que chama o use case
4. **Controller**: Adicionar rota GET `/produtos/preco?min=X&max=Y`
5. **Frontend**: Adicionar campos de filtro de preço

## 🚀 Padrões Utilizados

- **Dependency Inversion**: Camadas superiores não dependem de inferiores
- **Single Responsibility**: Cada classe tem uma responsabilidade
- **Interface Segregation**: Interfaces específicas para cada necessidade
- **Repository Pattern**: Abstração do acesso a dados
- **Use Case Pattern**: Regras de negócio isoladas

## 📊 Exemplo de Teste Unitário

```typescript
describe('CreateProdutoUseCase', () => {
  let useCase: CreateProdutoUseCase;
  let repository: ProdutoRepository;

  beforeEach(() => {
    repository = new ProdutoRepository(prisma);
    useCase = new CreateProdutoUseCase(repository);
  });

  it('should create a product successfully', async () => {
    const produtoData = {
      nome: 'Test Product',
      categoriaId: 1
    };

    const result = await useCase.execute(produtoData);
    expect(result.nome).toBe('Test Product');
  });

  it('should throw error for empty name', async () => {
    const produtoData = {
      nome: '',
      categoriaId: 1
    };

    await expect(useCase.execute(produtoData))
      .rejects.toThrow('Nome do produto é obrigatório');
  });
});
```

Esta arquitetura garante que o código seja **manutenível**, **testável** e **escalável**, seguindo as melhores práticas de desenvolvimento de software.
