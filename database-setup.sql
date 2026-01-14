-- =====================================================
-- CONFIGURAÇÕES PARA CRIAR TABELAS E OPERAÇÕES CRUD
-- Geovane Produtos API - PostgreSQL
-- =====================================================

-- 1. CRIAR BANCO DE DADOS (se não existir)
-- No pgAdmin ou psql, execute:
-- CREATE DATABASE "geovane-produtos-api" OWNER postgres;

-- 2. CONECTAR AO BANCO
-- \c geovane-produtos-api

-- =====================================================
-- SCRIPTS DDL - CRIAR TABELAS
-- =====================================================

-- Tabela Categoria
CREATE TABLE IF NOT EXISTS "Categoria" (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    "criadoEm" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela Produto
CREATE TABLE IF NOT EXISTS "Produto" (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    "codigoBarras" VARCHAR(255) UNIQUE,
    imagem BYTEA, -- Armazena imagem como dados binários
    descricao TEXT,
    observacao TEXT,
    "categoriaId" INTEGER NOT NULL REFERENCES "Categoria"(id) ON DELETE CASCADE,
    "criadoEm" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_produto_codigo_barras ON "Produto"("codigoBarras");
CREATE INDEX IF NOT EXISTS idx_produto_nome ON "Produto"(nome);
CREATE INDEX IF NOT EXISTS idx_produto_categoria ON "Produto"("categoriaId");

-- Trigger para atualizar campo atualizadoEm automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."atualizadoEm" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categoria_updated_at
    BEFORE UPDATE ON "Categoria"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_produto_updated_at
    BEFORE UPDATE ON "Produto"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SCRIPTS DML - INSERIR DADOS (SEED)
-- =====================================================

-- Inserir categorias de exemplo
INSERT INTO "Categoria" (nome, descricao) VALUES
('Bebidas', 'Produtos relacionados a bebidas'),
('Alimentos', 'Produtos alimentícios'),
('Limpeza', 'Produtos de limpeza e higiene'),
('Eletrônicos', 'Produtos eletrônicos e acessórios')
ON CONFLICT (nome) DO NOTHING;

-- =====================================================
-- SCRIPTS DQL - CONSULTAS (SELECT)
-- =====================================================

-- Selecionar todas as categorias
-- SELECT * FROM "Categoria" ORDER BY nome;

-- Selecionar todos os produtos com categoria
-- SELECT p.*, c.nome as categoria_nome
-- FROM "Produto" p
-- JOIN "Categoria" c ON p."categoriaId" = c.id
-- ORDER BY p."criadoEm" DESC;

-- Buscar produto por código de barras
-- SELECT p.*, c.nome as categoria_nome
-- FROM "Produto" p
-- JOIN "Categoria" c ON p."categoriaId" = c.id
-- WHERE p."codigoBarras" = '7891234567890';

-- Buscar produtos por nome (case insensitive)
-- SELECT p.*, c.nome as categoria_nome
-- FROM "Produto" p
-- JOIN "Categoria" c ON p."categoriaId" = c.id
-- WHERE LOWER(p.nome) LIKE LOWER('%coca%');

-- =====================================================
-- SCRIPTS DML - ATUALIZAR (UPDATE)
-- =====================================================

-- Atualizar nome de um produto
-- UPDATE "Produto"
-- SET nome = 'Coca-Cola 2L - Atualizado', "atualizadoEm" = CURRENT_TIMESTAMP
-- WHERE id = 1;

-- Atualizar categoria de produtos
-- UPDATE "Produto"
-- SET "categoriaId" = 2, "atualizadoEm" = CURRENT_TIMESTAMP
-- WHERE "categoriaId" = 1;

-- =====================================================
-- SCRIPTS DML - EXCLUIR (DELETE)
-- =====================================================

-- Excluir um produto específico
-- DELETE FROM "Produto" WHERE id = 1;

-- Excluir produtos de uma categoria (cascade)
-- DELETE FROM "Categoria" WHERE id = 1; -- Também exclui produtos relacionados

-- =====================================================
-- SCRIPTS DQL - RELATÓRIOS E ESTATÍSTICAS
-- =====================================================

-- Contar produtos por categoria
-- SELECT c.nome, COUNT(p.id) as total_produtos
-- FROM "Categoria" c
-- LEFT JOIN "Produto" p ON c.id = p."categoriaId"
-- GROUP BY c.id, c.nome
-- ORDER BY total_produtos DESC;

-- Produtos mais recentes (últimos 10)
-- SELECT p.nome, p."codigoBarras", c.nome as categoria, p."criadoEm"
-- FROM "Produto" p
-- JOIN "Categoria" c ON p."categoriaId" = c.id
-- ORDER BY p."criadoEm" DESC
-- LIMIT 10;

-- Produtos sem código de barras
-- SELECT p.*, c.nome as categoria
-- FROM "Produto" p
-- JOIN "Categoria" c ON p."categoriaId" = c.id
-- WHERE p."codigoBarras" IS NULL;

-- =====================================================
-- SCRIPTS DE MANUTENÇÃO
-- =====================================================

-- Verificar estrutura das tabelas
-- \d "Categoria"
-- \d "Produto"

-- Verificar índices
-- SELECT tablename, indexname, indexdef
-- FROM pg_indexes
-- WHERE tablename IN ('Categoria', 'Produto')
-- ORDER BY tablename, indexname;

-- Verificar constraints e foreign keys
-- SELECT
--     tc.table_name,
--     tc.constraint_name,
--     tc.constraint_type,
--     kcu.column_name,
--     ccu.table_name AS foreign_table_name,
--     ccu.column_name AS foreign_column_name
-- FROM information_schema.table_constraints tc
-- JOIN information_schema.key_column_usage kcu
--     ON tc.constraint_name = kcu.constraint_name
--     AND tc.table_schema = kcu.table_schema
-- LEFT JOIN information_schema.constraint_column_usage ccu
--     ON ccu.constraint_name = tc.constraint_name
--     AND ccu.table_schema = tc.table_schema
-- WHERE tc.table_name IN ('Categoria', 'Produto')
--     AND tc.constraint_type IN ('PRIMARY KEY', 'FOREIGN KEY')
-- ORDER BY tc.table_name, tc.constraint_name;

-- =====================================================
-- COMANDOS PRISMA EQUIVALENTES
-- =====================================================

-- Gerar cliente Prisma (depois de mudanças no schema)
-- npx prisma generate

-- Aplicar mudanças no banco (desenvolvimento)
-- npx prisma db push

-- Criar migração (produção)
-- npx prisma migrate dev

-- Resetar banco (desenvolvimento)
-- npx prisma migrate reset

-- Ver esquema do banco
-- npx prisma db pull

-- Executar seed
-- npx prisma db seed
