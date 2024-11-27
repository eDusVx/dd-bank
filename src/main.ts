import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { configDotenv } from 'dotenv'
import { LoggerInterceptor } from './modules/shared/interceptors/Logger.interceptor'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

configDotenv()

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.setGlobalPrefix('dd-bank')
    app.useGlobalPipes(new ValidationPipe())
    app.useGlobalInterceptors(app.get(LoggerInterceptor))

    const config = new DocumentBuilder()
        .setTitle('DD-BANK')
        .setDescription(
            'Aplicação que simula o funcionamento de um sistema bancário, implementando conceitos de Domain-Driven Design (DDD).',
        )
        .setVersion('1.0')
        .addBearerAuth()
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('dd-bank/docs', app, document)

    await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
