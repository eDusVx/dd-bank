import { Conta } from '../Conta'

export interface BuscarProximoIdQueryResponse {
    nextid: number
}

export interface ContaRepository {
    salvarConta(conta: Conta): Promise<void>
    salvarContas(contas: Conta[]): Promise<void>
    buscarProximoId(): Promise<number>
    buscarContaPorNumero(numeroConta: number): Promise<Conta>
}
