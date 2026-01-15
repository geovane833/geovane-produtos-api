import { IsString, IsOptional } from 'class-validator';

export class CreateCategoriaDto {
  @IsString()
  nome: string;

  @IsOptional()
  imagem?: string; // Base64 string
}
