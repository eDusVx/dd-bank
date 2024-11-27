import { Inject } from '@nestjs/common'
import { ClienteRepository } from '../../domain/repositories/Cliente.repository'
import { ClienteDto } from '../../domain/Cliente'

export class BuscarClientesQuery {
    constructor(
        @Inject('ClienteRepository')
        private readonly clienteRepository: ClienteRepository,
    ) {}

    async execute(request: string): Promise<ClienteDto | ClienteDto[]> {
        try {
            if (!request) {
                const buscarClientes = await this.clienteRepository.buscarTodos()

                return buscarClientes.map((cliente) => cliente.toDTO())
            }

            const cliente = await this.clienteRepository.buscarPorId(request)

            return cliente.toDTO()
        } catch (e) {
            throw e
        }
    }
}
