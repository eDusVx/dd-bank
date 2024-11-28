import { Inject } from '@nestjs/common'
import { LogarClienteRequest } from '../requests/Cliente.request'
import { AuthService } from '../../domain/services/Auth.service'
import { ClienteRepository } from '../../domain/repositories/Cliente.repository'
import { DadosNaoInformadosException } from '../../domain/exceptions/DadosNaoInformados.exception'

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
            if (!request.cpf) throw new DadosNaoInformadosException('O  cpf deve ser informado')
            const buscarCliente = await this.clienteRepository.buscarPorId(request.cpf)

            buscarCliente.verificarSenha(request.senha)

            const jwt = await this.authService.generateJwt(buscarCliente.getCpf())
            return { token: jwt }
        } catch (e) {
            throw e
        }
    }
}
