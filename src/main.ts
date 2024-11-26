import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { configDotenv } from 'dotenv'
import { LoggerInterceptor } from './modules/shared/interceptors/Logger.interceptor'

configDotenv()

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.setGlobalPrefix('dd-bank')
    app.useGlobalPipes(new ValidationPipe())
    app.useGlobalInterceptors(app.get(LoggerInterceptor))
    await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
