import { Injectable } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { CreateCategoriaUseCase } from './use-cases/create-categoria.use-case';
import { UpdateCategoriaUseCase } from './use-cases/update-categoria.use-case';
import { CategoriaRepository } from './repositories/categoria.repository';

@Injectable()
export class CategoriasService {
  constructor(
    private createCategoriaUseCase: CreateCategoriaUseCase,
    private updateCategoriaUseCase: UpdateCategoriaUseCase,
    private categoriaRepository: CategoriaRepository,
  ) {}

  async create(createCategoriaDto: CreateCategoriaDto) {
    return this.createCategoriaUseCase.execute(createCategoriaDto);
  }

  async findAll() {
    return this.categoriaRepository.findAll();
  }

  async findOne(id: number) {
    return this.categoriaRepository.findById(id);
  }

  async update(id: number, updateCategoriaDto: Partial<CreateCategoriaDto>) {
    return this.updateCategoriaUseCase.execute(id, updateCategoriaDto);
  }

  async remove(id: number) {
    return this.categoriaRepository.delete(id);
  }
}
