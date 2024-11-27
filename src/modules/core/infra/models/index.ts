import { ClienteModel } from './Cliente.model'
import { ContaBancariaModel } from './Conta.model'

export const modelsProviders = [
    {
        provide: 'ClienteModel',
        useValue: ClienteModel,
    },
    {
        provide: 'ContaModel',
        useValue: ContaBancariaModel,
    },
]

export const coreModels = [ClienteModel, ContaBancariaModel]
