import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './shared/prisma/prisma.service';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar limites maiores para upload de imagens (até 10MB)
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));

  // Habilitar CORS
  app.enableCors();

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  await app.listen(process.env.PORT ?? 3000);
  console.log(`API rodando em: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`Interface web em: http://localhost:${process.env.PORT ?? 3000}/index.html`);
}
bootstrap();
