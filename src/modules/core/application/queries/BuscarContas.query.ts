import { Inject } from '@nestjs/common'
import { ContaRepository } from '../../domain/repositories/Conta.repository'
import { ContaDto } from '../../domain/Conta'

export class BuscarContasQuery {
    constructor(
        @Inject('ContaRepository')
        private readonly contaRepository: ContaRepository,
    ) {}

    async execute(request: number): Promise<ContaDto | ContaDto[]> {
        try {
            const conta = await this.contaRepository.buscarContaPorNumero(request)

            return conta.toDTO()
        } catch (e) {
            throw e
        }
    }
}
