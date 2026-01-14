import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Post()
  create(@Body() createProdutoDto: CreateProdutoDto) {
    return this.produtosService.create(createProdutoDto);
  }

  @Get()
  findAll(@Query('nome') nome?: string) {
    if (nome) {
      return this.produtosService.findByNome(nome);
    }
    return this.produtosService.findAll();
  }

  @Get('codigo/:codigoBarras')
  findByCodigoBarras(@Param('codigoBarras') codigoBarras: string) {
    return this.produtosService.findByCodigoBarras(codigoBarras);
  }

  @Get('buscar-externo/:codigoBarras')
  async buscarProdutoExterno(@Param('codigoBarras') codigoBarras: string) {
    return this.produtosService.buscarProdutoExterno(codigoBarras);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.produtosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProdutoDto: UpdateProdutoDto) {
    return this.produtosService.update(+id, updateProdutoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.produtosService.remove(+id);
  }
}
