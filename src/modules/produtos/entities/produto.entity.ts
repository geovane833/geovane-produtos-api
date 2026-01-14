export class Produto {
  id: number;
  nome: string;
  codigoBarras?: string;
  imagem?: Buffer;
  descricao?: string;
  observacao?: string;
  categoriaId: number;
  criadoEm: Date;
  atualizadoEm: Date;
}
