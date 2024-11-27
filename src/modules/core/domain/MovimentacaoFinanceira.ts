import { v4 as uuidv4 } from 'uuid'
import { DepositoMenorIgualZeroException } from './exceptions/DepositoMenorIgualZero.exception'

export enum TIPO_MOVIMENTACAO {
    TRANSFERENCIA = 'TRANSFERENCIA',
    DEPOSITO = 'DEPOSITO',
    SAQUE = 'SAQUE',
}

export interface MovimentacaoFinanceiraDto {
    id: string
    valor: number
    data: Date
    tipoMovimentacao: TIPO_MOVIMENTACAO
    numeroContaOrigem: number
    numeroContaDestino?: number
}

export interface CriarMovimentacaoFinanceiraProps {
    valor: number
    data: Date
    tipoMovimentacao: TIPO_MOVIMENTACAO
    numeroContaOrigem?: number
    numeroContaDestino?: number
}

export interface CarregarMovimentacaoFinanceirarops {
    valor: number
    data: Date
    tipoMovimentacao: TIPO_MOVIMENTACAO
    numeroContaOrigem?: number
    numeroContaDestino?: number
}

export class MovimentacaoFinanceira {
    private id: string
    private valor: number
    private data: Date
    private tipoMovimentacao: TIPO_MOVIMENTACAO
    private numeroContaOrigem: number
    private numeroContaDestino?: number

    private constructor(id: string) {
        this.id = id
    }

    public static criar(props: CriarMovimentacaoFinanceiraProps): MovimentacaoFinanceira {
        const id = uuidv4()

        const instance = new MovimentacaoFinanceira(id)
        try {
            instance.setValor(props.valor)
            instance.setData(props.data)
            instance.setTipoMovimentacao(TIPO_MOVIMENTACAO[props.tipoMovimentacao])
            instance.setNumeroContaOrigem(props.numeroContaOrigem)
            instance.setNumeroContaDestino(props.numeroContaDestino)
        } catch (e) {
            throw e
        }

        return instance
    }

    public static carregar(props: CarregarMovimentacaoFinanceirarops, id: string): MovimentacaoFinanceira {
        const instance = new MovimentacaoFinanceira(id)
        try {
            instance.setValor(props.valor)
            instance.setData(props.data)
            instance.setTipoMovimentacao(TIPO_MOVIMENTACAO[props.tipoMovimentacao])
            instance.setNumeroContaOrigem(props.numeroContaOrigem)
            instance.setNumeroContaDestino(props.numeroContaDestino)
        } catch (e) {
            throw e
        }

        return instance
    }

    private setValor(valor: number) {
        try {
            this.valor = valor
        } catch (e) {
            throw e
        }
    }

    private setData(data: Date) {
        try {
            this.data = data
        } catch (e) {
            throw e
        }
    }

    private setTipoMovimentacao(tipoMovimentacao: TIPO_MOVIMENTACAO) {
        try {
            this.tipoMovimentacao = tipoMovimentacao
        } catch (e) {
            throw e
        }
    }

    private setNumeroContaOrigem(numeroContaOrigem: number) {
        try {
            this.numeroContaOrigem = numeroContaOrigem
        } catch (e) {
            throw e
        }
    }

    private setNumeroContaDestino(numeroContaDestino: number) {
        try {
            this.numeroContaDestino = numeroContaDestino
        } catch (e) {
            throw e
        }
    }

    public getId(): string {
        return this.id
    }

    public getNumeroContaOrigem(): number {
        return this.numeroContaOrigem
    }

    public getNumeroContaDestino(): number {
        return this.numeroContaDestino
    }

    public getValor(): number {
        return this.valor
    }

    public getData(): Date {
        return this.data
    }

    public getTipoMovimentacao(): TIPO_MOVIMENTACAO {
        return this.tipoMovimentacao
    }

    public toDTO(): MovimentacaoFinanceiraDto {
        return {
            id: this.getId(),
            valor: this.getValor(),
            data: this.getData(),
            tipoMovimentacao: this.getTipoMovimentacao(),
            numeroContaOrigem: this.getNumeroContaOrigem(),
            numeroContaDestino: this.getNumeroContaDestino(),
        }
    }

    public validarValorMovimentacao(): boolean {
        try {
            if (this.valor <= 0) {
                throw new DepositoMenorIgualZeroException('O depósito deve ser um valor maior que 0')
            }
            return true
        } catch (e) {
            throw e
        }
    }
}
