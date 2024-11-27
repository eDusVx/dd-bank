import { Inject } from '@nestjs/common'
import { ContaRepository } from '../../domain/repositories/Conta.repository'
// import { ContaNaoEcontradaException } from '../../domain/exceptions/ContaNaoEncontrada.exception'
import {
    MovimentacaoFinanceira,
    MovimentacaoFinanceiraDto,
    TIPO_MOVIMENTACAO,
} from '../../domain/MovimentacaoFinanceira'
import { EfeturarSaqueRequestDto } from '../requests/MovimentacaoFinanceira.request'

export class EfetuarSaqueUseCase {
    constructor(
        @Inject('ContaRepository')
        private readonly contaRepository: ContaRepository,
    ) {}
    async execute(request: EfeturarSaqueRequestDto): Promise<MovimentacaoFinanceiraDto> {
        try {
            const conta = await this.contaRepository.buscarContaPorNumero(request.numeroContaOrigem)
            // if (!conta) throw new ContaNaoEcontradaException('Nenhuma conta encontrada')

            const saque = MovimentacaoFinanceira.criar({
                valor: request.valor,
                data: new Date(),
                tipoMovimentacao: TIPO_MOVIMENTACAO.SAQUE,
                numeroContaOrigem: request.numeroContaOrigem,
            })

            conta.efetuarSaque(saque)

            await this.contaRepository.salvarConta(conta)

            return saque.toDTO()
        } catch (e) {
            throw e
        }
    }
}
