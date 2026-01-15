import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
// import { Categoria } from '@prisma/client'; // Removido para evitar erro do VS Code
import { CreateCategoriaDto } from '../dto/create-categoria.dto';

@Injectable()
export class CategoriaRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCategoriaDto): Promise<any> {
    const createData: any = {
      ...data,
      imagem: data.imagem ? Buffer.from(data.imagem, 'base64') : null,
    };
    return this.prisma.categoria.create({
      data: createData,
    });
  }

  async findByNome(nome: string): Promise<any> {
    return this.prisma.categoria.findFirst({
      where: {
        nome: {
          equals: nome,
          mode: 'insensitive',
        },
      },
    });
  }

  async findAll(): Promise<any[]> {
    return this.prisma.categoria.findMany({
      orderBy: { nome: 'asc' },
      include: {
        produtos: true,
      },
    });
  }

  async findById(id: number): Promise<any> {
    return this.prisma.categoria.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: Partial<CreateCategoriaDto>): Promise<any> {
    const updateData: any = { ...data };
    if (data.imagem) {
      updateData.imagem = Buffer.from(data.imagem, 'base64');
    }
    return this.prisma.categoria.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: number): Promise<any> {
    return this.prisma.categoria.delete({
      where: { id },
    });
  }
}
