import { Inject, Logger } from '@nestjs/common'
import { ClienteDto, CriarClienteDto } from '../../domain/dto/Cliente/Cliente.dto'
import { Cliente } from '../../domain/Cliente'
import { ClienteRepository } from '../../domain/repositories/Cliente.repository'
import { ParametrosInvalidosException } from '../../domain/exceptions/ParametrosInvalidos.exception'
import { LogService } from '../../../shared/domain/services/Log.service'

export class CriarClienteUseCase {
    private logger = new Logger('RegistrarUsuarioUseCase')

    constructor(
        @Inject('ClienteRepository')
        private readonly clienteRepository: ClienteRepository,
    ) {}
    async execute(request: CriarClienteDto): Promise<ClienteDto> {
        try {
            if (!request) throw new ParametrosInvalidosException('Parâmetros não informados')

            const cliente = await Cliente.criar({
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
