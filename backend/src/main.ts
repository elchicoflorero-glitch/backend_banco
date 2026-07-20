import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Set global API prefix
  app.setGlobalPrefix('api');
  
  // Enable CORS with proper configuration
  const corsOrigin = process.env.CORS_ORIGIN || '*';
  const corsOriginArray = corsOrigin.split(',').map(origin => origin.trim());
  
  app.enableCors({
    origin: corsOriginArray.length === 1 ? corsOriginArray[0] : corsOriginArray,
    credentials: process.env.CORS_CREDENTIALS === 'true',
  });
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  
  // Global exception filters
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // Global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());
  
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('BancoPeru API')
    .setDescription('Sistema bancario completo con gestión de clientes, cuentas y transferencias')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
}
bootstrap();