import { CarregarContaDto, ContaDto, CriarContaDto } from './dto/Conta.dto'
import { ParametrosInvalidosException } from './exceptions/ParametrosInvalidos.exception'
import { SaldoInsuficienteException } from './exceptions/SaldoInsuficiente.exception'
import { StatusContaInvalidoEception } from './exceptions/StatusContaInvalido.exception'
import { MovimentacaoFinanceira, TIPO_MOVIMENTACAO } from './MovimentacaoFinanceira'

export enum STATUS_CONTA {
    ATIVA = 'ATIVA',
    INATIVA = 'INATIVA',
}

export class Conta {
    private numeroConta?: number
    private saldo: number
    private status: STATUS_CONTA
    private clienteId: string
    private movimentacaoFinanceira: MovimentacaoFinanceira[]

    private constructor(numeroConta?: number) {
        this.numeroConta = numeroConta
    }

    public static criar(props: CriarContaDto): Conta {
        const instance = new Conta(props.numeroConta)
        try {
            instance.setSaldo(0)
            instance.setStatus(STATUS_CONTA.ATIVA)
            instance.setClienteId(props.clienteId)
        } catch (e) {
            throw e
        }

        return instance
    }

    public static carregar(props: CarregarContaDto, numeroConta: number): Conta {
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
            this.saldo = saldo
        } catch (e) {
            throw e
        }
    }

    private setStatus(status: STATUS_CONTA) {
        try {
            this.status = status
        } catch (e) {
            throw e
        }
    }

    private setClienteId(clienteId: string) {
        try {
            this.clienteId = clienteId
        } catch (e) {
            throw e
        }
    }

    private setMovimentacaoFinanceira(movimentacaoFinanceira: MovimentacaoFinanceira[]) {
        try {
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

            movimentacao.validarValorMovimentacao()
            const novoSaldo = this.saldo + movimentacao.getValor()

            this.setSaldo(novoSaldo)

            this.movimentacaoFinanceira.push(movimentacao)
        } catch (e) {
            throw e
        }
    }

    public efetuarSaque(movimentacao: MovimentacaoFinanceira): void {
        try {
            this.validarStatusConta(movimentacao.getTipoMovimentacao())

            movimentacao.validarValorMovimentacao()

            if (this.saldo < movimentacao.getValor()) {
                throw new SaldoInsuficienteException(
                    `Saldo insuficiente para a transação ${movimentacao.getTipoMovimentacao()}`,
                )
            }

            const novoSaldo = this.saldo - movimentacao.getValor()

            this.setSaldo(novoSaldo)

            this.movimentacaoFinanceira.push(movimentacao)
        } catch (e) {
            throw e
        }
    }

    public efetuarTransferencia(movimentacao: MovimentacaoFinanceira): void {
        try {
            let novoSaldo: number
            this.validarStatusConta(movimentacao.getTipoMovimentacao())

            movimentacao.validarValorMovimentacao()

            if (this.numeroConta == movimentacao.getNumeroContaOrigem()) {
                if (this.saldo < movimentacao.getValor()) {
                    throw new SaldoInsuficienteException(
                        `Saldo insuficiente para a transação ${movimentacao.getTipoMovimentacao()}`,
                    )
                }
                novoSaldo = this.saldo - movimentacao.getValor()
            } else if (this.numeroConta == movimentacao.getNumeroContaDestino()) {
                novoSaldo = this.saldo + movimentacao.getValor()
            } else {
                throw new ParametrosInvalidosException('A conta não está associada à transferencia atual')
            }

            this.setSaldo(novoSaldo)

            this.movimentacaoFinanceira.push(movimentacao)
        } catch (e) {
            throw e
        }
    }

    private validarStatusConta(tipoMovimentacao: TIPO_MOVIMENTACAO): void {
        if (this.status != STATUS_CONTA.ATIVA) {
            throw new StatusContaInvalidoEception(
                `A conta precisa estar com status ${STATUS_CONTA.ATIVA} para efetuar a operação ${tipoMovimentacao}`,
            )
        }
    }
}
