import { Module } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CategoriaRepository } from './repositories/categoria.repository';
import { CreateCategoriaUseCase } from './use-cases/create-categoria.use-case';
import { UpdateCategoriaUseCase } from './use-cases/update-categoria.use-case';

@Module({
  controllers: [CategoriasController],
  providers: [
    CategoriasService,
    PrismaService,
    CategoriaRepository,
    CreateCategoriaUseCase,
    UpdateCategoriaUseCase,
  ],
  exports: [CategoriaRepository, CreateCategoriaUseCase, UpdateCategoriaUseCase], // Exportar para outros módulos usarem
})
export class CategoriasModule {}
