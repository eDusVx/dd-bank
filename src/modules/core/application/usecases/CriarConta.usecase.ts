import { Inject } from '@nestjs/common'
import { ContaDto, CriarContaDto } from '../../domain/dto/Conta.dto'
import { ParametrosInvalidosException } from '../../domain/exceptions/ParametrosInvalidos.exception'
import { Conta } from '../../domain/Conta'
import { ContaRepository } from '../../domain/repositories/Conta.repository'

export class CriarContaUseCase {
    constructor(
        @Inject('ContaRepository')
        private readonly contaRepository: ContaRepository,
    ) {}
    async execute(request: CriarContaDto): Promise<ContaDto> {
        try {
            if (!request) throw new ParametrosInvalidosException('Parâmetros não informados')

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
