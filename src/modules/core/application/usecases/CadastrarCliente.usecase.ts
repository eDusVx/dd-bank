import { Inject } from '@nestjs/common'
import { Cliente, ClienteDto } from '../../domain/Cliente'
import { ClienteRepository } from '../../domain/repositories/Cliente.repository'
import { CadastrarClienteRequestDto } from '../dto/Cliente.dto'

export class CadastrarClienteUseCase {
    constructor(
        @Inject('ClienteRepository')
        private readonly clienteRepository: ClienteRepository,
    ) {}
    async execute(request: CadastrarClienteRequestDto): Promise<ClienteDto> {
        try {
            const cliente = Cliente.criar({
                nome: request.nome,
                cpf: request.cpf,
                dataNascimento: new Date(request.dataNascimento),
            })

            await this.clienteRepository.salvarCliente(cliente)

            return cliente.toDTO()
        } catch (e) {
            throw e
        }
    }
}