import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { databaseProviders } from 'sequelize.config'
import { modules } from './modules'

@Module({
    imports: [...modules],
    controllers: [AppController],
    providers: [AppService, ...databaseProviders],
})
export class AppModule {}
