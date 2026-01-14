import { Injectable } from '@nestjs/common';
import { Produto } from '@prisma/client';
import { ProdutoRepository } from '../repositories/produto.repository';

@Injectable()
export class FindByCodigoBarrasUseCase {
  constructor(private produtoRepository: ProdutoRepository) {}

  async execute(codigoBarras: string): Promise<Produto | null> {
    if (!codigoBarras || codigoBarras.trim().length === 0) {
      throw new Error('Código de barras é obrigatório');
    }

    return this.produtoRepository.findByCodigoBarras(codigoBarras);
  }
}
