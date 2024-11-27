import { Inject } from '@nestjs/common'
import { ContaRepository } from '../../domain/repositories/Conta.repository'

import {
    MovimentacaoFinanceira,
    MovimentacaoFinanceiraDto,
    TIPO_MOVIMENTACAO,
} from '../../domain/MovimentacaoFinanceira'
import { EfeturarTransferenciaRequest } from '../requests/MovimentacaoFinanceira.request'

export class EfetuarTransferenciaUseCase {
    constructor(
        @Inject('ContaRepository')
        private readonly contaRepository: ContaRepository,
    ) {}
    async execute(request: EfeturarTransferenciaRequest): Promise<MovimentacaoFinanceiraDto> {
        try {
            const contaOrigemSaque = await this.contaRepository.buscarContaPorNumero(request.numeroContaOrigem)

            const contaDestinoSaque = await this.contaRepository.buscarContaPorNumero(request.numeroContaDestino)

            const transferencia = MovimentacaoFinanceira.criar({
                valor: request.valor,
                data: new Date(),
                tipoMovimentacao: TIPO_MOVIMENTACAO.TRANSFERENCIA,
                numeroContaOrigem: request.numeroContaOrigem,
                numeroContaDestino: request.numeroContaDestino,
            })

            contaOrigemSaque.efetuarTransferencia(transferencia)

            contaDestinoSaque.efetuarTransferencia(transferencia)

            await this.contaRepository.salvarContas([contaDestinoSaque, contaOrigemSaque])

            return transferencia.toDTO()
        } catch (e) {
            throw e
        }
    }
}
