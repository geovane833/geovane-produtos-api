import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateProdutoDto {
  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  codigoBarras?: string;

  @IsOptional()
  @IsString()
  imagem?: string; // Base64 encoded image

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsString()
  observacao?: string;

  @IsInt()
  categoriaId: number; // ID da categoria selecionada
}
