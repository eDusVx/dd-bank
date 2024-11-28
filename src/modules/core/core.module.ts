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
import { JwtModule } from '@nestjs/jwt'
import { AuthServiceImpl } from './infra/services/Auth.service'

@Module({
    imports: [
        ...coreModels,
        JwtModule.registerAsync({
            global: true,
            useFactory: async () => ({
                secret: process.env.JWT_TOKEN,
                signOptions: { expiresIn: '60s' },
            }),
        }),
    ],
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
        {
            provide: 'AuthService',
            useClass: AuthServiceImpl,
        },
    ],
})
export class CoreModule {}
