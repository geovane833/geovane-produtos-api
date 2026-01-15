import { Injectable, NotFoundException } from '@nestjs/common';
import { Categoria } from '@prisma/client';
import { CategoriaRepository } from '../repositories/categoria.repository';
import { CreateCategoriaDto } from '../dto/create-categoria.dto';

@Injectable()
export class UpdateCategoriaUseCase {
  constructor(private categoriaRepository: CategoriaRepository) {}

  async execute(id: number, updateCategoriaDto: Partial<CreateCategoriaDto>): Promise<Categoria> {
    console.log('UpdateCategoriaUseCase.execute called with id:', id, 'dto:', updateCategoriaDto);

    // Verificar se a categoria existe
    const categoriaExistente = await this.categoriaRepository.findById(id);
    console.log('Existing categoria:', categoriaExistente);
    if (!categoriaExistente) {
      throw new NotFoundException(`Categoria com ID ${id} não encontrada`);
    }

    // Se está atualizando o nome, verificar se já existe outra categoria com esse nome
    if (updateCategoriaDto.nome) {
      const nomeMaiusculo = updateCategoriaDto.nome.toUpperCase();
      console.log('Checking name uniqueness for:', nomeMaiusculo);
      const categoriaComMesmoNome = await this.categoriaRepository.findByNome(nomeMaiusculo);

      if (categoriaComMesmoNome && categoriaComMesmoNome.id !== id) {
        throw new NotFoundException(`Categoria "${nomeMaiusculo}" já existe`);
      }

      updateCategoriaDto.nome = nomeMaiusculo;
    }

    if (updateCategoriaDto.nome && updateCategoriaDto.nome.trim().length === 0) {
      throw new NotFoundException('Nome da categoria é obrigatório');
    }

    console.log('Final update data:', updateCategoriaDto);
    return this.categoriaRepository.update(id, updateCategoriaDto);
  }
}
