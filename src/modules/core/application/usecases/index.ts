import { AtualizarStatusContaUseCase } from './AualizarStatusConta.usecase'
import { CadastrarClienteUseCase } from './CadastrarCliente.usecase'
import { CriarContaUseCase } from './CriarConta.usecase'
import { EfetuarDepositoUseCase } from './EfetuarDeposito.usecase'
import { EfetuarSaqueUseCase } from './EfetuarSaque.usecase'
import { EfetuarTransferenciaUseCase } from './EfetuarTransferencia.usecase'

export const usecases = [
    CadastrarClienteUseCase,
    CriarContaUseCase,
    AtualizarStatusContaUseCase,
    EfetuarDepositoUseCase,
    EfetuarSaqueUseCase,
    EfetuarTransferenciaUseCase,
]
