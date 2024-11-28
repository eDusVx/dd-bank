import { Inject } from '@nestjs/common'
import { LogarClienteRequest } from '../requests/Cliente.request'
import { AuthService } from '../../domain/services/Auth.service'
import { ClienteRepository } from '../../domain/repositories/Cliente.repository'

export interface LogarClienteUseCaseResponse {
    token: string
}

export class EfetuarLoginClienteUseCase {
    constructor(
        @Inject('ClienteRepository')
        private readonly clienteRepository: ClienteRepository,
        @Inject('AuthService')
        private readonly authService: AuthService,
    ) {}
    async execute(request: LogarClienteRequest): Promise<LogarClienteUseCaseResponse> {
        try {
            const buscarCliente = await this.clienteRepository.buscarPorId(request.cpf)

            buscarCliente.verificarSenha(request.senha)

            const jwt = await this.authService.generateJwt(buscarCliente.getCpf())
            return { token: jwt }
        } catch (e) {
            throw e
        }
    }
}
