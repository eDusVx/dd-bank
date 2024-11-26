import { Module } from '@nestjs/common'
import { ClientesController } from './clientes.controller'
import { usecases } from './application/usecases'
import { mappers } from './infra/mappers'
import { queries } from './application/queries'
import { ClienteRepositoryImpl } from './infra/repositories/Cliente.repository'
import { coreModels, modelsProviders } from './infra/models'
import { ContasController } from './contas.controller'
import { MovimentacoesController } from './movimentacoes.controller'
import { ContaRepositoryImpl } from './infra/repositories/Conta.repository'

@Module({
    imports: [...coreModels],
    controllers: [ClientesController, ContasController, MovimentacoesController],
    providers: [
        ...queries,
        ...mappers,
        ...usecases,
        ...modelsProviders,
        {
            provide: 'ClienteRepository',
            useClass: ClienteRepositoryImpl,
        },
        {
            provide: 'ContaRepository',
            useClass: ContaRepositoryImpl,
        },
    ],
})
export class CoreModule {}
