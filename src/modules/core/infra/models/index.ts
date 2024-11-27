import { ClienteModel } from './Cliente.model'
import { ContaBancariaModel } from './Conta.model'
import { MovimentacaoFinanceiraModel } from './MovimentacaoFinanceira.model'

export const modelsProviders = [
    {
        provide: 'ClienteModel',
        useValue: ClienteModel,
    },
    {
        provide: 'ContaModel',
        useValue: ContaBancariaModel,
    },
    {
        provide: 'MovimentacoesModel',
        useValue: MovimentacaoFinanceiraModel,
    },
]

export const coreModels = [ClienteModel, MovimentacaoFinanceiraModel, ContaBancariaModel]
