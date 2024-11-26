import { AtualizarStatusContaUseCase } from './AualizarStatusConta.usecase'
import { CriarClienteUseCase } from './CriarCliente.usecase'
import { CriarContaUseCase } from './CriarConta.usecase'
import { EfetuarDepositoUseCase } from './EfetuarDepositoUseCase.usecase'

export const usecases = [CriarClienteUseCase, CriarContaUseCase, AtualizarStatusContaUseCase, EfetuarDepositoUseCase]
