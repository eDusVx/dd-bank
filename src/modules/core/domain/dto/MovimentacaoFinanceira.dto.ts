import { TIPO_MOVIMENTACAO } from '../MovimentacaoFinanceira'

export class CriarMovimentacaoFinanceiraDto {
    id: string
    valor: number
    data: Date
    tipoMovimentacao: TIPO_MOVIMENTACAO
    numeroContaOrigem: number
    numeroContaDestino?: number
}

export class MovimentacaoFinanceiraDto {
    id: string
    valor: number
    data: Date
    tipoMovimentacao: TIPO_MOVIMENTACAO
    numeroContaOrigem: number
    numeroContaDestino?: number
}

