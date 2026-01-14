# Sistema de Gerenciamento de Produtos - Frontend

## 📋 Visão Geral

Este é um sistema completo de gerenciamento de produtos com arquitetura frontend modular, desenvolvido com JavaScript vanilla e integração com API NestJS.

## 🏗️ Arquitetura Modular Organizada

O frontend foi organizado em pastas temáticas para melhor manutenção e escalabilidade:

### 📁 Estrutura dos Arquivos

```
frontend/
├── index.html                    # 🏠 Página principal com interface completa
├── cadastrar-produto.html       # 🆕 Nova tela completa de cadastro
├── cadastro.html                # 📝 Página alternativa de cadastro
├── script.js                    # 🔧 Arquivo principal que importa módulos
├── README.md                    # 📖 Documentação
│
├── produto/                     # 📦 Módulos relacionados a produtos
│   ├── product-functions.js     # Funções específicas de produtos
│   ├── modal-produto.html       # Modal de cadastro de produto
│   ├── modal-editar-produto.html # Modal de edição de produto
│   └── modal-finalizar-produto.html # Modal de finalização
│
├── categoria/                   # 🏷️ Módulos relacionados a categorias
│   ├── category-functions.js    # Funções específicas de categorias
│   └── modal-categoria.html     # Modal de cadastro de categoria
│
├── shared/                      # 🔄 Recursos compartilhados
│   ├── utils.js                 # Funções utilitárias (fileToBase64, etc.)
│   ├── api.js                   # Comunicação com API REST
│   ├── modal-functions.js       # Sistema genérico de modais
│   └── ui-functions.js          # Interface e sistema de notificações
│
└── styles/                      # 🎨 Arquivos de estilo
    └── styles.css               # Estilos globais da aplicação
```

## 🚀 Como Usar

### 1. **Página Principal (index.html)**
- Abra `index.html` no navegador
- Contém 3 abas: Produtos, Categorias, Busca EAN
- Botões para cadastrar produto e categoria abrem modais diretamente

### 2. **Funcionalidades Disponíveis**

#### 📦 **Gerenciamento de Produtos**
- **Cadastrar Produto**: Busca por código de barras + finalização manual
- **Editar Produto**: Modifica dados existentes
- **Excluir Produto**: Remove do sistema
- **Visualizar Lista**: Tabela com paginação e filtros
- **Nota**: Botão de cadastro de categoria fica na aba "🏷️ Categorias"

#### 🏷️ **Gerenciamento de Categorias**
- **Cadastrar Categoria**: Adiciona nova categoria
- **Editar Categoria**: Modifica nome existente
- **Excluir Categoria**: Remove (com validação)
- **Listar Categorias**: Visualiza todas as categorias

#### 🔍 **Busca EAN**
- Busca produto específico por código de barras
- Mostra detalhes se encontrado
- Permite cadastro se não existir

### 3. **Fluxo de Cadastro de Produto**

```
1. Clique "🚀 Cadastrar Produto"
   ↓
2. Modal abre para digitar código de barras
   ↓
3. Sistema busca na API externa (Cosmos/BlueSoft)
   ↓
4. Modal mostra produto encontrado
   ↓
5. Modal de finalização permite adicionar:
   - Observação (opcional)
   - Categoria (obrigatória)
   ↓
6. Produto é salvo no banco local
```

## 🛠️ Funcionalidades Técnicas

### 📡 **API Integration**
- Comunicação com backend NestJS
- Tratamento de erros robusto
- Suporte a CORS e autenticação

### 🎨 **Interface Responsiva**
- Design moderno com gradientes
- Modal system elegante
- Notificações flutuantes
- Loading states visuais

### 🔧 **Utilitários Incluídos**
- Conversão de imagens para Base64
- Validação de formulários
- Manipulação de datas
- Formatação de dados

## 📝 Scripts Disponíveis

### **Páginas HTML**
- `index.html` - Interface principal com abas
- `cadastrar-produto.html` - 🆕 **Nova tela completa de cadastro de produtos**
- `cadastro.html` - Página dedicada de cadastro (funcionalidade similar)

### **Nova Página: `cadastrar-produto.html`**
Página dedicada e completa para cadastro de produtos com:

#### **🎯 Funcionalidades:**
- **🔍 Busca por Código de Barras**: Campo para digitar EAN
- **🤖 Busca Automática**: Integração com API EAN Pictures
- **📋 Preview do Produto**: Mostra imagem, nome, marca, categoria
- **📝 Formulário Completo**: Nome, descrição, observação, categoria
- **🏷️ Sistema de Categorias**: Busca, seleção e criação de novas
- **💾 Cadastro Final**: Salva produto no sistema

#### **🎨 Interface:**
- **Design Responsivo**: Funciona em desktop e mobile
- **Navegação Clara**: Seções organizadas por etapas
- **Feedback Visual**: Estados de carregamento e confirmações
- **Experiência Fluida**: Transições suaves entre etapas

#### **🔄 Fluxo de Uso:**
```
1. Digitar código de barras
2. Buscar automaticamente na API
3. Visualizar produto encontrado
4. Preencher formulário completo
5. Selecionar categoria (com busca)
6. Cadastrar produto
```

### **Módulos JavaScript**
- `utils.js` - Funções utilitárias
- `api.js` - Comunicação com API
- `modal-functions.js` - Sistema de modais
- `ui-functions.js` - Interface e notificações
- `product-functions.js` - Lógica de produtos
- `category-functions.js` - Lógica de categorias

## 🎯 Funcionalidades Especiais

### **Busca Inteligente**
- Verifica primeiro no banco local
- Depois busca na API externa
- Trata erros gracefully

### **Validações**
- Códigos de barras únicos
- Categorias obrigatórias
- Formatos de imagem suportados

### **Experiência do Usuário**
- Feedback visual em tempo real
- Confirmações de ações
- Estados de carregamento
- Mensagens de erro claras

## 🔧 Desenvolvimento

### **Adicionando Novos Módulos**
1. Crie arquivo `novo-modulo.js`
2. Adicione import no `script.js`
3. Inclua script na página HTML

### **Personalizando Estilos**
- Modifique `styles.css` para temas
- Cada modal pode ter estilos próprios
- Suporte a variáveis CSS

### **Extendendo Funcionalidades**
- Adicione novos endpoints na API
- Crie novos tipos de modal
- Implemente validações customizadas

## 🚀 Deploy

1. Configure o backend NestJS
2. Sirva os arquivos HTML/JS/CSS
3. Configure CORS se necessário
4. Teste todas as funcionalidades

---

**Desenvolvido com ❤️ para gerenciamento eficiente de produtos**
