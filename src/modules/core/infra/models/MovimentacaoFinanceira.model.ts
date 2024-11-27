import { TIPO_MOVIMENTACAO } from '../../domain/MovimentacaoFinanceira'

export interface MovimentacaoFinanceiraModelProps {
    id: string
    contaOrigemId: number
    contaDestinoId: number
    tipo: TIPO_MOVIMENTACAO
    valor: number
    dataHora: Date
}
export class MovimentacaoFinanceiraModel {
    id: string
    contaOrigemId: number
    contaDestinoId: number
    tipo: TIPO_MOVIMENTACAO
    valor: number
    dataHora: Date
    public setProps(props: MovimentacaoFinanceiraModelProps) {
        Object.assign(this, props)
    }
}
