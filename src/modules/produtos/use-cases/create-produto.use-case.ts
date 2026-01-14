import { Injectable, ConflictException } from '@nestjs/common';
import { Produto } from '@prisma/client';
import { ProdutoRepository } from '../repositories/produto.repository';
import { CategoriaRepository } from '../../categorias/repositories/categoria.repository';
import { CreateCategoriaUseCase } from '../../categorias/use-cases/create-categoria.use-case';
import { CreateProdutoDto } from '../dto/create-produto.dto';

@Injectable()
export class CreateProdutoUseCase {
  constructor(
    private produtoRepository: ProdutoRepository,
    private categoriaRepository: CategoriaRepository,
    private createCategoriaUseCase: CreateCategoriaUseCase,
  ) {}

  async execute(createProdutoDto: CreateProdutoDto): Promise<Produto> {
    // Validações de negócio podem ser adicionadas aqui
    if (!createProdutoDto.nome || createProdutoDto.nome.trim().length === 0) {
      throw new Error('Nome do produto é obrigatório');
    }

    if (!createProdutoDto.categoriaId || createProdutoDto.categoriaId <= 0) {
      throw new Error('Categoria é obrigatória');
    }

    // Verificar se a categoria existe
    const categoria = await this.categoriaRepository.findById(createProdutoDto.categoriaId);
    if (!categoria) {
      throw new Error('Categoria selecionada não existe');
    }

    // Verificar se já existe um produto com o mesmo código de barras
    if (createProdutoDto.codigoBarras) {
      const produtoExistente = await this.produtoRepository.findByCodigoBarras(createProdutoDto.codigoBarras);
      if (produtoExistente) {
        throw new ConflictException(`Já existe um produto cadastrado com o código de barras ${createProdutoDto.codigoBarras}`);
      }
    }

    // Converter nome para maiúsculo
    const produtoData = {
      ...createProdutoDto,
      nome: createProdutoDto.nome.toUpperCase()
    };

    return this.produtoRepository.create(produtoData);
  }
}
