import { Inject } from '@nestjs/common'
import { Conta, ContaDto } from '../../domain/Conta'
import { ContaRepository } from '../../domain/repositories/Conta.repository'
import { CriarContaRequest } from '../requests/Conta.request'
import { ClienteRepository } from '../../domain/repositories/Cliente.repository'

export class CriarContaUseCase {
    constructor(
        @Inject('ContaRepository')
        private readonly contaRepository: ContaRepository,
        @Inject('ClienteRepository')
        private readonly clienteRepository: ClienteRepository,
    ) {}
    async execute(request: CriarContaRequest): Promise<ContaDto> {
        try {
            const buscarCliente = await this.clienteRepository.buscarPorId(request.clienteId)

            const idConta = await this.contaRepository.buscarProximoId()

            const conta = Conta.criar({
                numeroConta: idConta,
                clienteId: buscarCliente.getCpf(),
            })

            await this.contaRepository.salvarConta(conta)

            return conta.toDTO()
        } catch (e) {
            throw e
        }
    }
}
