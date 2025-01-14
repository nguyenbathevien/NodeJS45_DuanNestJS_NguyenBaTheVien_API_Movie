import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseSuccessInterceptor } from './common/interceptor/response-success.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { AllExceptionFilter } from './common/filter/all-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: []
  })
  app.useGlobalPipes(new ValidationPipe())
  const reflector =  app.get(Reflector)
  app.useGlobalInterceptors(new ResponseSuccessInterceptor(reflector))
  app.useGlobalFilters(new AllExceptionFilter())
  app.useGlobalGuards(new JwtAuthGuard(reflector))
  
  const config = new DocumentBuilder()
  .setTitle('Cats example')
  .setDescription('The cats API description')
  .setVersion('1.0')
  .addBearerAuth({type:'http',scheme:'bearer',bearerFormat:'JWT'},'access-token')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  document.security = [{ 'access-token': [] }];

SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
