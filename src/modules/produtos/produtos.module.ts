import { Module } from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { ProdutosController } from './produtos.controller';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { ProdutoRepository } from './repositories/produto.repository';
import { CreateProdutoUseCase } from './use-cases/create-produto.use-case';
import { FindAllProdutosUseCase } from './use-cases/find-all-produtos.use-case';
import { FindByCodigoBarrasUseCase } from './use-cases/find-by-codigo-barras.use-case';
import { FindByNomeUseCase } from './use-cases/find-by-nome.use-case';
import { UpdateProdutoUseCase } from './use-cases/update-produto.use-case';
import { DeleteProdutoUseCase } from './use-cases/delete-produto.use-case';
import { CategoriasModule } from '../categorias/categorias.module';

@Module({
  imports: [CategoriasModule], // Importar para usar os serviços de categoria
  controllers: [ProdutosController],
  providers: [
    ProdutosService,
    PrismaService,
    ProdutoRepository,
    CreateProdutoUseCase,
    FindAllProdutosUseCase,
    FindByCodigoBarrasUseCase,
    FindByNomeUseCase,
    UpdateProdutoUseCase,
    DeleteProdutoUseCase,
  ],
})
export class ProdutosModule {}
