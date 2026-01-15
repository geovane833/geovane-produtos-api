import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
// import { Categoria } from '@prisma/client'; // Removido para evitar erro do VS Code
import { CreateCategoriaDto } from '../dto/create-categoria.dto';

@Injectable()
export class CategoriaRepository {
  constructor(private prisma: PrismaService) {}

  private convertBase64ToBuffer(base64String: string): Buffer {
    // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
    const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
    return Buffer.from(base64Data, 'base64');
  }

  async create(data: CreateCategoriaDto): Promise<any> {
    const createData: any = {
      ...data,
      imagem: data.imagem ? this.convertBase64ToBuffer(data.imagem) : null,
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
    console.log('CategoriaRepository.update called with id:', id, 'data:', data);
    const updateData: any = {};

    // Copiar apenas os campos que foram fornecidos
    if (data.nome !== undefined) {
      updateData.nome = data.nome;
    }

    // Para imagem, só incluir se foi fornecida explicitamente
    if (data.imagem !== undefined) {
      if (data.imagem === null) {
        console.log('Setting imagem to null');
        updateData.imagem = null;
      } else {
        console.log('Converting imagem from base64');
        updateData.imagem = this.convertBase64ToBuffer(data.imagem);
      }
    } else {
      console.log('Imagem not provided, not updating');
    }

    console.log('Final updateData for Prisma:', updateData);

    if (Object.keys(updateData).length === 0) {
      console.log('No fields to update, skipping Prisma call');
      // Se não há nada para atualizar, buscar e retornar a categoria atual
      return this.findById(id);
    }

    try {
      const result = await this.prisma.categoria.update({
        where: { id },
        data: updateData,
      });
      console.log('Prisma update result:', result);
      return result;
    } catch (error) {
      console.error('Prisma update error:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<any> {
    return this.prisma.categoria.delete({
      where: { id },
    });
  }
}
