import { Injectable } from '@nestjs/common';
import { Produto } from '@prisma/client';
import { ProdutoRepository } from '../repositories/produto.repository';

@Injectable()
export class DeleteProdutoUseCase {
  constructor(private produtoRepository: ProdutoRepository) {}

  async execute(id: number): Promise<Produto> {
    if (!id || id <= 0) {
      throw new Error('ID do produto é obrigatório');
    }

    // Verificar se o produto existe
    const produtoExistente = await this.produtoRepository.findById(id);
    if (!produtoExistente) {
      throw new Error('Produto não encontrado');
    }

    return this.produtoRepository.delete(id);
  }
}
