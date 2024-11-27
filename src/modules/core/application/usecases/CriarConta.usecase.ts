import { Inject } from '@nestjs/common'
import { Conta, ContaDto } from '../../domain/Conta'
import { ContaRepository } from '../../domain/repositories/Conta.repository'
import { CriarContaRequestDto } from '../dto/Conta.dto'

export class CriarContaUseCase {
    constructor(
        @Inject('ContaRepository')
        private readonly contaRepository: ContaRepository,
    ) {}
    async execute(request: CriarContaRequestDto): Promise<ContaDto> {
        try {
            const idConta = await this.contaRepository.buscarProximoId()

            const conta = Conta.criar({
                numeroConta: idConta,
                clienteId: request.clienteId,
            })

            await this.contaRepository.salvarConta(conta)

            return conta.toDTO()
        } catch (e) {
            throw e
        }
    }
}
