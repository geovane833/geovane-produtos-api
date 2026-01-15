import { IsString, IsOptional, IsInt, IsNumber, IsBoolean, Min } from 'class-validator';

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

  @IsOptional()
  @IsString()
  marca?: string;

  @IsOptional()
  @IsString()
  modelo?: string;

  @IsOptional()
  @IsString()
  unidadeMedida?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  peso?: number;

  @IsOptional()
  @IsString()
  dimensoes?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @IsInt()
  categoriaId: number; // ID da categoria selecionada
}
