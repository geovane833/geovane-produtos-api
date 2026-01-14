import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { Categoria } from '@prisma/client';
import { CreateCategoriaDto } from '../dto/create-categoria.dto';

@Injectable()
export class CategoriaRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCategoriaDto): Promise<Categoria> {
    return this.prisma.categoria.create({
      data,
    });
  }

  async findByNome(nome: string): Promise<Categoria | null> {
    return this.prisma.categoria.findFirst({
      where: {
        nome: {
          equals: nome,
          mode: 'insensitive',
        },
      },
    });
  }

  async findAll(): Promise<Categoria[]> {
    return this.prisma.categoria.findMany({
      orderBy: { nome: 'asc' },
      include: {
        produtos: true,
      },
    });
  }

  async findById(id: number): Promise<Categoria | null> {
    return this.prisma.categoria.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: Partial<CreateCategoriaDto>): Promise<Categoria> {
    return this.prisma.categoria.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Categoria> {
    return this.prisma.categoria.delete({
      where: { id },
    });
  }
}
