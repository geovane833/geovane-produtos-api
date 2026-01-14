import { Injectable, BadRequestException } from '@nestjs/common';
import { Categoria } from '@prisma/client';
import { CategoriaRepository } from '../repositories/categoria.repository';
import { CreateCategoriaDto } from '../dto/create-categoria.dto';

@Injectable()
export class CreateCategoriaUseCase {
  constructor(private categoriaRepository: CategoriaRepository) {}

  async execute(createCategoriaDto: CreateCategoriaDto): Promise<Categoria> {
    // Converter nome para maiúsculo
    const nomeMaiusculo = createCategoriaDto.nome.toUpperCase();

    // Verificar se já existe uma categoria com esse nome
    const categoriaExistente = await this.categoriaRepository.findByNome(nomeMaiusculo);

    if (categoriaExistente) {
      throw new BadRequestException(`Categoria "${nomeMaiusculo}" já existe`);
    }

    if (!createCategoriaDto.nome || createCategoriaDto.nome.trim().length === 0) {
      throw new BadRequestException('Nome da categoria é obrigatório');
    }

    return this.categoriaRepository.create({
      nome: nomeMaiusculo
    });
  }
}
