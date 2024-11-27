import { Inject } from '@nestjs/common'
import { ContaDto, STATUS_CONTA } from '../../domain/Conta'
import { ContaRepository } from '../../domain/repositories/Conta.repository'

interface AtualizarStatusContaRequestDto {
    numeroConta: number
    status: STATUS_CONTA
}

export class AtualizarStatusContaUseCase {
    constructor(
        @Inject('ContaRepository')
        private readonly contaRepository: ContaRepository,
    ) {}
    async execute(request: AtualizarStatusContaRequestDto): Promise<ContaDto> {
        try {
            const conta = await this.contaRepository.buscarContaPorNumero(request.numeroConta)

            conta.atualizarStatus(STATUS_CONTA[request.status])

            await this.contaRepository.salvarConta(conta)

            return conta.toDTO()
        } catch (e) {
            throw e
        }
    }
}
