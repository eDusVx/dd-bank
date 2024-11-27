import { Inject } from '@nestjs/common'
import { ContaRepository } from '../../domain/repositories/Conta.repository'
import { ContaNaoEcontradaException } from '../../domain/exceptions/ContaNaoEcontrada.exception'
import {
    MovimentacaoFinanceira,
    MovimentacaoFinanceiraDto,
    TIPO_MOVIMENTACAO,
} from '../../domain/MovimentacaoFinanceira'
import { EfeturarTransferenciaRequestDto } from '../dto/MovimentacaoFinanceira.dto'

export class EfetuarTransferenciaUseCase {
    constructor(
        @Inject('ContaRepository')
        private readonly contaRepository: ContaRepository,
    ) {}
    async execute(request: EfeturarTransferenciaRequestDto): Promise<MovimentacaoFinanceiraDto> {
        try {
            const contaOrigemSaque = await this.contaRepository.buscarContaPorNumero(request.numeroContaOrigem)
            if (!contaOrigemSaque) {
                throw new ContaNaoEcontradaException('Conta de origem não encontrada')
            }

            const contaDestinoSaque = await this.contaRepository.buscarContaPorNumero(request.numeroContaDestino)
            if (!contaDestinoSaque) {
                throw new ContaNaoEcontradaException('Conta de destino não encontrada')
            }

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
