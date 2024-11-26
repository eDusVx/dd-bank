import { Inject, Logger } from '@nestjs/common'
import { ClienteDto } from '../../domain/dto/Cliente/Cliente.dto'
import { ClienteRepository } from '../../domain/repositories/Cliente.repository'

export class BuscarClientesQuery {
    private readonly logger = new Logger(BuscarClientesQuery.name)

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
