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
            const contaOrigemTransferencia = await this.contaRepository.buscarContaPorNumero(request.numeroContaOrigem)

            contaOrigemTransferencia.validarStatusConta(TIPO_MOVIMENTACAO.TRANSFERENCIA)

            const contaDestinoTransferencia = await this.contaRepository.buscarContaPorNumero(
                request.numeroContaDestino,
            )

            contaDestinoTransferencia.validarStatusConta(TIPO_MOVIMENTACAO.TRANSFERENCIA)

            const transferencia = MovimentacaoFinanceira.criar({
                valor: request.valor,
                data: new Date(),
                tipoMovimentacao: TIPO_MOVIMENTACAO.TRANSFERENCIA,
                numeroContaOrigem: request.numeroContaOrigem,
                numeroContaDestino: request.numeroContaDestino,
            })

            contaOrigemTransferencia.efetuarTransferencia(transferencia)

            contaDestinoTransferencia.efetuarTransferencia(transferencia)

            await this.contaRepository.salvarContas([contaDestinoTransferencia, contaOrigemTransferencia])

            return transferencia.toDTO()
        } catch (e) {
            throw e
        }
    }
}
