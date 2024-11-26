import { STATUS_CONTA } from '../Conta'
import { MovimentacaoFinanceira } from '../MovimentacaoFinanceira'
import { MovimentacaoFinanceiraDto } from './MovimentacaoFinanceira.dto'

export class CriarContaDto {
    numeroConta?: number
    saldo: number
    status: STATUS_CONTA
    clienteId: string
    movimentacaoFinanceira?: MovimentacaoFinanceira[]
}

export class ContaDto {
    numeroConta?: number
    saldo: number
    status: STATUS_CONTA
    clienteId: string
    movimentacaoFinanceira: MovimentacaoFinanceiraDto[]
}
