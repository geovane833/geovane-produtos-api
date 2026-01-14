import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { Produto } from '@prisma/client';
import { CreateProdutoDto } from '../dto/create-produto.dto';
import { UpdateProdutoDto } from '../dto/update-produto.dto';

@Injectable()
export class ProdutoRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProdutoDto): Promise<Produto> {
    return this.prisma.produto.create({
      data: {
        ...data,
        imagem: data.imagem ? Buffer.from(data.imagem, 'base64') : null,
      },
      include: {
        categoria: true,
      },
    });
  }

  async findAll(): Promise<Produto[]> {
    return this.prisma.produto.findMany({
      include: {
        categoria: true,
      },
    });
  }

  async findById(id: number): Promise<Produto | null> {
    return this.prisma.produto.findUnique({
      where: { id },
      include: {
        categoria: true,
      },
    });
  }

  async findByCodigoBarras(codigoBarras: string): Promise<Produto | null> {
    return this.prisma.produto.findUnique({
      where: { codigoBarras },
      include: {
        categoria: true,
      },
    });
  }

  async findByNome(nome: string): Promise<Produto[]> {
    return this.prisma.produto.findMany({
      where: {
        nome: {
          contains: nome,
          mode: 'insensitive',
        },
      },
      include: {
        categoria: true,
      },
    });
  }

  async update(id: number, data: UpdateProdutoDto): Promise<Produto> {
    return this.prisma.produto.update({
      where: { id },
      data: {
        ...data,
        imagem: data.imagem ? Buffer.from(data.imagem, 'base64') : undefined,
      },
      include: {
        categoria: true,
      },
    });
  }

  async delete(id: number): Promise<Produto> {
    return this.prisma.produto.delete({
      where: { id },
    });
  }
}
