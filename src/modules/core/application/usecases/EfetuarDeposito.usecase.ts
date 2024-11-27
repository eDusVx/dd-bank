import { Inject } from '@nestjs/common'
import { ContaRepository } from '../../domain/repositories/Conta.repository'

import {
    MovimentacaoFinanceira,
    MovimentacaoFinanceiraDto,
    TIPO_MOVIMENTACAO,
} from '../../domain/MovimentacaoFinanceira'
import { EfeturarDepositoRequest } from '../requests/MovimentacaoFinanceira.request'

export class EfetuarDepositoUseCase {
    constructor(
        @Inject('ContaRepository')
        private readonly contaRepository: ContaRepository,
    ) {}
    async execute(request: EfeturarDepositoRequest): Promise<MovimentacaoFinanceiraDto> {
        try {
            const conta = await this.contaRepository.buscarContaPorNumero(request.numeroContaDestino)
            // if (!conta) throw new ContaNaoEcontradaException('Nenhuma conta encontrada')

            const deposito = MovimentacaoFinanceira.criar({
                valor: request.valor,
                data: new Date(),
                tipoMovimentacao: TIPO_MOVIMENTACAO.DEPOSITO,
                numeroContaDestino: request.numeroContaDestino,
            })

            conta.efetuarDeposito(deposito)

            await this.contaRepository.salvarConta(conta)

            return deposito.toDTO()
        } catch (e) {
            throw e
        }
    }
}
