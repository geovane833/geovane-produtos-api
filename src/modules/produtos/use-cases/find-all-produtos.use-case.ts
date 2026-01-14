import { Injectable } from '@nestjs/common';
import { Produto } from '@prisma/client';
import { ProdutoRepository } from '../repositories/produto.repository';

@Injectable()
export class FindAllProdutosUseCase {
  constructor(private produtoRepository: ProdutoRepository) {}

  async execute(): Promise<Produto[]> {
    return this.produtoRepository.findAll();
  }
}
