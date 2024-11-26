import { Inject } from '@nestjs/common'
import { ContaDto } from '../../domain/dto/Conta.dto'
import { ParametrosInvalidosException } from '../../domain/exceptions/ParametrosInvalidos.exception'
import { STATUS_CONTA } from '../../domain/Conta'
import { ContaRepository } from '../../domain/repositories/Conta.repository'

interface AtualizarStatusContaRequest {
    numeroConta: number
    status: STATUS_CONTA
}

export class AtualizarStatusContaUseCase {
    constructor(
        @Inject('ContaRepository')
        private readonly contaRepository: ContaRepository,
    ) {}
    async execute(request: AtualizarStatusContaRequest): Promise<ContaDto> {
        try {
            if (!request) throw new ParametrosInvalidosException('Parâmetros não informados')

            const conta = await this.contaRepository.buscarContaPorNumero(request.numeroConta)

            conta.atualizarStatus(STATUS_CONTA[request.status])

            await this.contaRepository.salvarConta(conta)

            return conta.toDTO()
        } catch (e) {
            throw e
        }
    }
}
