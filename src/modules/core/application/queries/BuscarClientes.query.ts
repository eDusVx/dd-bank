import { Inject } from '@nestjs/common'
import { ClienteRepository } from '../../domain/repositories/Cliente.repository'
import { ClienteDto } from '../../domain/Cliente'
import { DadosNaoInformadosException } from '../../domain/exceptions/DadosNaoInformados.exception'

export class BuscarClientesQuery {
    constructor(
        @Inject('ClienteRepository')
        private readonly clienteRepository: ClienteRepository,
    ) {}

    async execute(request: string): Promise<ClienteDto | ClienteDto[]> {
        try {
            if (!request) throw new DadosNaoInformadosException('O cpf do cliente deve ser informado')

            const cliente = await this.clienteRepository.buscarPorId(request)

            return cliente.toDTO()
        } catch (e) {
            throw e
        }
    }
}
