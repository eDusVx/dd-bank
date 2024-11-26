import { Module } from '@nestjs/common'
import { ClientesController } from './clientes.controller'
import { usecases } from './application/usecases'
import { mappers } from './infra/mappers'
import { queries } from './application/queries'
import { ClienteRepositoryImpl } from './infra/repositories/Cliente.repository'
import { coreModels, modelsProviders } from './infra/models'

@Module({
    imports: [...coreModels],
    controllers: [ClientesController],
    providers: [
        ...queries,
        ...mappers,
        ...usecases,
        ...modelsProviders,
        {
            provide: 'ClienteRepository',
            useClass: ClienteRepositoryImpl,
        },
    ],
})
export class CoreModule {}
