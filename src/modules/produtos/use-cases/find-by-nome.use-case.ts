import { Injectable } from '@nestjs/common';
import { Produto } from '@prisma/client';
import { ProdutoRepository } from '../repositories/produto.repository';

@Injectable()
export class FindByNomeUseCase {
  constructor(private produtoRepository: ProdutoRepository) {}

  async execute(nome: string): Promise<Produto[]> {
    if (!nome || nome.trim().length === 0) {
      throw new Error('Nome para busca é obrigatório');
    }

    return this.produtoRepository.findByNome(nome);
  }
}
