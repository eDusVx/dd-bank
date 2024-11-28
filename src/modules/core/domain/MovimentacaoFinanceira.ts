import { v4 as uuidv4 } from 'uuid'
import { isEmpty, isNumber, isPositive, maxDate, isDate, isString, isEnum, min } from 'class-validator'
import { MovimentacaoFinanceiraException } from './exceptions/MovimentacaoFinanceira.exception'
import { TipoMovimetacaoInvalidoException } from './exceptions/TipoMovimetacaoInvalido.exception'
import { MesmaContaTransferenciaException } from './exceptions/MesmaContaTransferencia.exception'

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
    numeroContaOrigem?: number
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
            if (isEmpty(valor)) throw new MovimentacaoFinanceiraException('O valor não pode ser nulo')
            if (!isNumber(valor)) throw new MovimentacaoFinanceiraException('O valor deve ser do tipo number')
            if (!isPositive(valor)) throw new MovimentacaoFinanceiraException('O valor deve ser maior que 0')
            this.valor = valor
        } catch (e) {
            throw e
        }
    }

    private setData(data: Date) {
        try {
            if (isEmpty(data)) throw new MovimentacaoFinanceiraException('A data da movimentação não pode ser nula')
            if (!isDate(data))
                throw new MovimentacaoFinanceiraException('A data da movimentaçãoo do cliente tem que ser do tipo Data')
            if (!maxDate(data, new Date()))
                throw new MovimentacaoFinanceiraException('A data da movimentação deve ser anterior à data atual.')
            this.data = data
        } catch (e) {
            throw e
        }
    }

    private setTipoMovimentacao(tipoMovimentacao: TIPO_MOVIMENTACAO) {
        try {
            if (isEmpty(tipoMovimentacao))
                throw new MovimentacaoFinanceiraException('O tipo da movimentação não pode ser nulo')
            if (!isString(tipoMovimentacao))
                throw new MovimentacaoFinanceiraException('O tipo da movimentação deve ser do tipo string')
            if (!isEnum(tipoMovimentacao, TIPO_MOVIMENTACAO)) {
                throw new MovimentacaoFinanceiraException(
                    `Tipo da movimentação inválido, deve ser [${Object.values(TIPO_MOVIMENTACAO)}]`,
                )
            }
            this.tipoMovimentacao = tipoMovimentacao
        } catch (e) {
            throw e
        }
    }

    private setNumeroContaOrigem(numeroContaOrigem?: number) {
        try {
            if (numeroContaOrigem) {
                if (!min(numeroContaOrigem, 1))
                    throw new MovimentacaoFinanceiraException(
                        'O numero da conta de origem tem que comecar maior ou igual a 1',
                    )
                if (!isNumber(numeroContaOrigem))
                    throw new MovimentacaoFinanceiraException('O numero da conta de origem tem que ser do tipo number')
            }
            this.numeroContaOrigem = numeroContaOrigem
        } catch (e) {
            throw e
        }
    }

    private setNumeroContaDestino(numeroContaDestino?: number) {
        try {
            if (numeroContaDestino) {
                if (!min(numeroContaDestino, 1))
                    throw new MovimentacaoFinanceiraException(
                        'O numero da conta de destino tem que comecar maior ou igual a 1',
                    )
                if (!isNumber(numeroContaDestino))
                    throw new MovimentacaoFinanceiraException('O numero da conta de destino tem que ser do tipo number')
            }
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

    public validarTipoMovimentacao(tipoMovimentacao: TIPO_MOVIMENTACAO): void {
        if (this.tipoMovimentacao != tipoMovimentacao)
            throw new TipoMovimetacaoInvalidoException(
                'O tipo do processo efetuado em conta é diferente da movimentação enviada',
            )
    }

    public validarTransferencia(): void {
        if (this.numeroContaDestino == this.numeroContaOrigem) {
            throw new MesmaContaTransferenciaException('As contas devem ser diferentes para realizar uma transferência')
        }
    }
}
