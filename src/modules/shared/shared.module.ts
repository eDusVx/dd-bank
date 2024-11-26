import { Module } from '@nestjs/common'
import { LogModel } from './infra/models/Log.model'
import { modelsProviders } from './infra/models'
import { LogRepositoryImpl } from './infra/repositories/Log.repository'
import { LogServiceImpl } from './infra/services/Log.service'
import { LoggerInterceptor } from './interceptors/Logger.interceptor'

@Module({
    imports: [LogModel],
    controllers: [],
    providers: [
        ...modelsProviders,
        {
            provide: 'LogRepository',
            useClass: LogRepositoryImpl,
        },
        {
            provide: 'LogService',
            useClass: LogServiceImpl,
        },
        LoggerInterceptor,
    ],
})
export class SharedModule {}
