import { AtualizarStatusContaUseCase } from './AualizarStatusConta.usecase'
import { CriarClienteUseCase } from './CriarCliente.usecase'
import { CriarContaUseCase } from './CriarConta.usecase'
import { EfetuarDepositoUseCase } from './EfetuarDeposito.usecase'
import { EfetuarSaqueUseCase } from './EfetuarSaque.usecase'
import { EfetuarTransferenciaUseCase } from './EfetuarTransferencia.usecase'

export const usecases = [
    CriarClienteUseCase,
    CriarContaUseCase,
    AtualizarStatusContaUseCase,
    EfetuarDepositoUseCase,
    EfetuarSaqueUseCase,
    EfetuarTransferenciaUseCase,
]
