import { Injectable } from '@nestjs/common';
import { Produto } from '@prisma/client';
import { ProdutoRepository } from '../repositories/produto.repository';
import { UpdateProdutoDto } from '../dto/update-produto.dto';

@Injectable()
export class UpdateProdutoUseCase {
  constructor(private produtoRepository: ProdutoRepository) {}

  async execute(id: number, updateProdutoDto: UpdateProdutoDto): Promise<Produto> {
    if (!id || id <= 0) {
      throw new Error('ID do produto é obrigatório');
    }

    // Verificar se o produto existe
    const produtoExistente = await this.produtoRepository.findById(id);
    if (!produtoExistente) {
      throw new Error('Produto não encontrado');
    }

    return this.produtoRepository.update(id, updateProdutoDto);
  }
}
