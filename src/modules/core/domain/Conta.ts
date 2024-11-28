import { isArray, isEmpty, isEnum, isNegative, isNumber, isString, matches } from 'class-validator'
import { ContaException } from './exceptions/Conta.exception'
import { SaldoInsuficienteException } from './exceptions/SaldoInsuficiente.exception'
import { StatusContaInvalidoEception } from './exceptions/StatusContaInvalido.exception'
import { MovimentacaoFinanceira, MovimentacaoFinanceiraDto, TIPO_MOVIMENTACAO } from './MovimentacaoFinanceira'
import { isLength } from 'validator'

export enum STATUS_CONTA {
    ATIVA = 'ATIVA',
    INATIVA = 'INATIVA',
}

export interface CriarContaProps {
    clienteId: string
    numeroConta: number
}

export interface CarregarContaProps {
    clienteId: string
    saldo: number
    status: STATUS_CONTA
    movimentacaoFinanceira: MovimentacaoFinanceira[]
}

export interface ContaDto {
    clienteId: string
    numeroConta: number
    saldo: number
    status: STATUS_CONTA
    movimentacaoFinanceira: MovimentacaoFinanceiraDto[]
}

export class Conta {
    private numeroConta: number
    private saldo: number
    private status: STATUS_CONTA
    private clienteId: string
    private movimentacaoFinanceira: MovimentacaoFinanceira[]

    private constructor(numeroConta: number) {
        this.numeroConta = numeroConta
    }

    public static criar(props: CriarContaProps): Conta {
        if (isEmpty(props.numeroConta)) throw new ContaException('O id da conta não pode ser nulo')

        if (isNegative(props.numeroConta)) throw new ContaException('O id da conta não pode ser negativo')

        if (!isNumber(props.numeroConta)) throw new ContaException('O id da conta tem que ser um numero')

        const instance = new Conta(props.numeroConta)
        try {
            instance.setSaldo(0)
            instance.setStatus(STATUS_CONTA.ATIVA)
            instance.setClienteId(props.clienteId)
            instance.setMovimentacaoFinanceira([])
        } catch (e) {
            throw e
        }

        return instance
    }

    public static carregar(props: CarregarContaProps, numeroConta: number): Conta {
        const instance = new Conta(numeroConta)
        try {
            instance.setSaldo(props.saldo)
            instance.setStatus(STATUS_CONTA[props.status])
            instance.setClienteId(props.clienteId)
            instance.setMovimentacaoFinanceira(props.movimentacaoFinanceira)
        } catch (e) {
            throw e
        }

        return instance
    }

    private setSaldo(saldo: number) {
        try {
            if (isEmpty(saldo)) throw new ContaException('O saldo não pode ser nulo')
            if (!isNumber(saldo)) throw new ContaException('O saldo deve ser do tipo number')
            if (isNegative(saldo)) throw new ContaException('O saldo não pode ser negativo')
            this.saldo = saldo
        } catch (e) {
            throw e
        }
    }

    private setStatus(status: STATUS_CONTA) {
        try {
            if (isEmpty(status)) throw new ContaException('O status não pode ser nulo')
            if (!isString(status)) throw new ContaException('O status deve ser do tipo string')
            if (!isEnum(status, STATUS_CONTA)) {
                throw new ContaException(`Status de conta inválido, deve ser [${Object.values(STATUS_CONTA)}]`)
            }

            this.status = status
        } catch (e) {
            throw e
        }
    }

    private setClienteId(clienteId: string) {
        try {
            if (isEmpty(clienteId)) throw new ContaException('O cpf do cliente não pode ser nulo')
            if (!isString(clienteId)) throw new ContaException('O cpf do cliente deve ser do tipo string')
            if (!isLength(clienteId, { min: 11, max: 11 }))
                throw new ContaException('O cpf do cliente deve ter 11 dígitos.')
            if (!matches(clienteId, /^\d{11}$/)) throw new ContaException('O CPF deve conter apenas números.')

            this.clienteId = clienteId
        } catch (e) {
            throw e
        }
    }

    private setMovimentacaoFinanceira(movimentacaoFinanceira: MovimentacaoFinanceira[]) {
        try {
            if (isEmpty(movimentacaoFinanceira))
                throw new ContaException('As movimentações financeiras não podem ser nulas')
            if (!isArray(movimentacaoFinanceira))
                throw new ContaException('As movimentações financeiras devem ser do tipo array')

            this.movimentacaoFinanceira = movimentacaoFinanceira
        } catch (e) {
            throw e
        }
    }

    public getStatus(): STATUS_CONTA {
        return this.status
    }

    public getClienteId(): string {
        return this.clienteId
    }

    public getSaldo(): number {
        return this.saldo
    }

    public getNumeroConta(): number {
        return this.numeroConta
    }

    public getMovimentacaoFinanceira(): MovimentacaoFinanceira[] {
        return this.movimentacaoFinanceira
    }

    public toDTO(): ContaDto {
        return {
            numeroConta: this.getNumeroConta(),
            saldo: this.getSaldo(),
            status: this.getStatus(),
            clienteId: this.getClienteId(),
            movimentacaoFinanceira: this.movimentacaoFinanceira
                ? this.movimentacaoFinanceira.map((movimentacao) => movimentacao.toDTO())
                : [],
        }
    }

    public atualizarStatus(status: STATUS_CONTA): void {
        try {
            this.setStatus(status)
        } catch (e) {
            throw e
        }
    }

    public efetuarDeposito(movimentacao: MovimentacaoFinanceira): void {
        try {
            this.validarStatusConta(movimentacao.getTipoMovimentacao())

            movimentacao.validarTipoMovimentacao(TIPO_MOVIMENTACAO.DEPOSITO)

            const novoSaldo = this.saldo + movimentacao.getValor()

            this.setSaldo(this.tratarValores(novoSaldo))

            this.movimentacaoFinanceira.push(movimentacao)
        } catch (e) {
            throw e
        }
    }

    public efetuarSaque(movimentacao: MovimentacaoFinanceira): void {
        try {
            this.validarStatusConta(movimentacao.getTipoMovimentacao())

            movimentacao.validarTipoMovimentacao(TIPO_MOVIMENTACAO.SAQUE)

            if (this.saldo < movimentacao.getValor()) {
                throw new SaldoInsuficienteException(
                    `Saldo insuficiente para a transação ${movimentacao.getTipoMovimentacao()}`,
                )
            }

            const novoSaldo = this.saldo - movimentacao.getValor()

            this.setSaldo(this.tratarValores(novoSaldo))

            this.movimentacaoFinanceira.push(movimentacao)
        } catch (e) {
            throw e
        }
    }

    public efetuarTransferencia(movimentacao: MovimentacaoFinanceira): void {
        try {
            let novoSaldo: number

            movimentacao.validarTipoMovimentacao(TIPO_MOVIMENTACAO.TRANSFERENCIA)

            this.validarStatusConta(movimentacao.getTipoMovimentacao())

            if (this.numeroConta == movimentacao.getNumeroContaOrigem()) {
                if (this.saldo < movimentacao.getValor()) {
                    throw new SaldoInsuficienteException(
                        `Saldo insuficiente para a transação ${movimentacao.getTipoMovimentacao()}`,
                    )
                }
                novoSaldo = this.saldo - movimentacao.getValor()
            } else if (this.numeroConta == movimentacao.getNumeroContaDestino()) {
                novoSaldo = this.saldo + movimentacao.getValor()
            }

            this.setSaldo(this.tratarValores(novoSaldo))

            this.movimentacaoFinanceira.push(movimentacao)
        } catch (e) {
            throw e
        }
    }

    public validarStatusConta(tipoMovimentacao: TIPO_MOVIMENTACAO): void {
        if (this.status != STATUS_CONTA.ATIVA) {
            throw new StatusContaInvalidoEception(
                `A conta de número ${this.numeroConta} precisa estar com status ${STATUS_CONTA.ATIVA} para efetuar a operação ${tipoMovimentacao}`,
            )
        }
    }

    private tratarValores(valor: number): number {
        return parseFloat(valor.toFixed(2))
    }
}
