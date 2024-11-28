import { Conta } from './Conta'
import { ContaException } from './exceptions/Conta.exception'
import { MovimentacaoFinanceira, TIPO_MOVIMENTACAO } from './MovimentacaoFinanceira'
import { STATUS_CONTA } from './Conta'
import { StatusContaInvalidoEception } from './exceptions/StatusContaInvalido.exception'
import { SaldoInsuficienteException } from './exceptions/SaldoInsuficiente.exception'

describe('Conta', () => {
    describe('criação da conta', () => {
        it('deve criar uma conta com saldo inicial zero e status ATIVA', () => {
            const props = { clienteId: '12345678901', numeroConta: 12345 }
            const conta = Conta.criar(props)

            expect(conta.getSaldo()).toBe(0)
            expect(conta.getStatus()).toBe(STATUS_CONTA.ATIVA)
            expect(conta.getClienteId()).toBe('12345678901')
            expect(conta.getNumeroConta()).toBe(12345)
        })

        it('deve lançar erro se o clienteId for inválido', () => {
            const props = { clienteId: 'invalidCpf', numeroConta: 12345 }

            expect(() => Conta.criar(props)).toThrow(ContaException)
        })
    })

    describe('setSaldo', () => {
        it('deve lançar erro se o saldo for negativo', () => {
            const props = { clienteId: '12345678901', numeroConta: 12345 }
            const conta = Conta.criar(props)

            expect(() => conta['setSaldo'](-100)).toThrow(ContaException)
        })

        it('deve definir saldo corretamente', () => {
            const props = { clienteId: '12345678901', numeroConta: 12345 }
            const conta = Conta.criar(props)
            expect(conta.getSaldo()).toBe(0)
        })
    })

    describe('efetuarDeposito', () => {
        it('deve efetuar depósito corretamente', () => {
            const props = { clienteId: '12345678901', numeroConta: 1 }
            const conta = Conta.criar(props)
            const movimentacao = MovimentacaoFinanceira.criar({
                valor: 200,
                data: new Date('2001-05-30'),
                tipoMovimentacao: TIPO_MOVIMENTACAO.DEPOSITO,
                numeroContaDestino: conta.getNumeroConta(),
            })

            conta.efetuarDeposito(movimentacao)

            expect(conta.getSaldo()).toBe(movimentacao.getValor())
            expect(conta.getMovimentacaoFinanceira().length).toBe(1)
        })

        it('deve lançar erro se a conta estiver inativa', () => {
            const props = { clienteId: '12345678901', numeroConta: 12345 }
            const conta = Conta.criar(props)
            conta.atualizarStatus(STATUS_CONTA.INATIVA)
            const movimentacao = MovimentacaoFinanceira.criar({
                valor: 200,
                data: new Date('2001-05-30'),
                tipoMovimentacao: TIPO_MOVIMENTACAO.DEPOSITO,
                numeroContaDestino: conta.getNumeroConta(),
            })

            expect(() => conta.efetuarDeposito(movimentacao)).toThrow(StatusContaInvalidoEception)
        })
    })

    describe('efetuarSaque', () => {
        it('deve efetuar saque corretamente', () => {
            const props = { clienteId: '12345678901', numeroConta: 12345 }
            const conta = Conta.criar(props)
            const deposito = MovimentacaoFinanceira.criar({
                valor: 200,
                data: new Date('2001-05-30'),
                tipoMovimentacao: TIPO_MOVIMENTACAO.DEPOSITO,
                numeroContaDestino: conta.getNumeroConta(),
            })
            conta.efetuarDeposito(deposito)

            const saque = MovimentacaoFinanceira.criar({
                valor: 200,
                data: new Date('2001-05-30'),
                tipoMovimentacao: TIPO_MOVIMENTACAO.SAQUE,
                numeroContaOrigem: conta.getNumeroConta(),
            })
            conta.efetuarSaque(saque)

            expect(conta.getSaldo()).toBe(0)
        })

        it('deve lançar erro se o saldo for insuficiente', () => {
            const props = { clienteId: '12345678901', numeroConta: 12345 }
            const conta = Conta.criar(props)
            const saque = MovimentacaoFinanceira.criar({
                valor: 200,
                data: new Date('2001-05-30'),
                tipoMovimentacao: TIPO_MOVIMENTACAO.SAQUE,
                numeroContaOrigem: conta.getNumeroConta(),
            })

            expect(() => conta.efetuarSaque(saque)).toThrow(SaldoInsuficienteException)
        })

        it('deve lançar erro se a conta estiver inativa', () => {
            const props = { clienteId: '12345678901', numeroConta: 12345 }
            const conta = Conta.criar(props)
            conta.atualizarStatus(STATUS_CONTA.INATIVA)
            const saque = MovimentacaoFinanceira.criar({
                valor: 200,
                data: new Date('2001-05-30'),
                tipoMovimentacao: TIPO_MOVIMENTACAO.SAQUE,
                numeroContaOrigem: conta.getNumeroConta(),
            })

            expect(() => conta.efetuarSaque(saque)).toThrow(StatusContaInvalidoEception)
        })
    })

    describe('efetuarTransferencia', () => {
        it('deve efetuar transferência corretamente', () => {
            const props = { clienteId: '12345678901', numeroConta: 1 }
            const contaOrigem = Conta.criar(props)
            const contaDestino = Conta.criar({ clienteId: '09876543210', numeroConta: 2 })

            const depositoOrigem = MovimentacaoFinanceira.criar({
                valor: 200,
                data: new Date('2001-05-30'),
                tipoMovimentacao: TIPO_MOVIMENTACAO.DEPOSITO,
                numeroContaDestino: contaDestino.getNumeroConta(),
            })
            contaOrigem.efetuarDeposito(depositoOrigem)

            const transferencia = MovimentacaoFinanceira.criar({
                valor: 200,
                data: new Date('2001-05-30'),
                tipoMovimentacao: TIPO_MOVIMENTACAO.TRANSFERENCIA,
                numeroContaDestino: contaDestino.getNumeroConta(),
                numeroContaOrigem: contaOrigem.getNumeroConta(),
            })
            contaOrigem.efetuarTransferencia(transferencia)
            contaDestino.efetuarTransferencia(transferencia)


            expect(contaOrigem.getSaldo()).toBe(0)
            expect(contaDestino.getSaldo()).toBe(200)
        })

        it('deve lançar erro se a conta estiver inativa', () => {
            const props = { clienteId: '12345678901', numeroConta: 12345 }
            const contaOrigem = Conta.criar(props)
            contaOrigem.atualizarStatus(STATUS_CONTA.INATIVA)

            const transferencia = MovimentacaoFinanceira.criar({
                valor: 200,
                data: new Date('2001-05-30'),
                tipoMovimentacao: TIPO_MOVIMENTACAO.TRANSFERENCIA,
                numeroContaDestino: 1,
                numeroContaOrigem: contaOrigem.getNumeroConta(),
            })

            expect(() => contaOrigem.efetuarTransferencia(transferencia)).toThrow(StatusContaInvalidoEception)
        })

        it('deve lançar erro se o saldo for insuficiente', () => {
            const props = { clienteId: '12345678901', numeroConta: 1 }
            const contaOrigem = Conta.criar(props)

            const transferencia = MovimentacaoFinanceira.criar({
                valor: 200,
                data: new Date('2001-05-30'),
                tipoMovimentacao: TIPO_MOVIMENTACAO.TRANSFERENCIA,
                numeroContaDestino: 2,
                numeroContaOrigem: contaOrigem.getNumeroConta(),
            })

            expect(() => contaOrigem.efetuarTransferencia(transferencia)).toThrow(SaldoInsuficienteException)
        })
    })
})
