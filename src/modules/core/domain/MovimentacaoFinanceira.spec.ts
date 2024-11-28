import { MovimentacaoFinanceira, TIPO_MOVIMENTACAO } from './MovimentacaoFinanceira'
import { MovimentacaoFinanceiraException } from './exceptions/MovimentacaoFinanceira.exception'
import { TipoMovimetacaoInvalidoException } from './exceptions/TipoMovimetacaoInvalido.exception'

describe('MovimentacaoFinanceira', () => {
    it('deve criar uma movimentação financeira com valores válidos', () => {
        const movimentacao = MovimentacaoFinanceira.criar({
            valor: 1000,
            data: new Date(),
            tipoMovimentacao: TIPO_MOVIMENTACAO.TRANSFERENCIA,
            numeroContaOrigem: 1,
            numeroContaDestino: 2,
        })

        expect(movimentacao).toBeDefined()
        expect(movimentacao.getValor()).toBe(1000)
        expect(movimentacao.getTipoMovimentacao()).toBe(TIPO_MOVIMENTACAO.TRANSFERENCIA)
    })

    it('deve carregar uma movimentação financeira com valores válidos', () => {
        const movimentacao = MovimentacaoFinanceira.carregar(
            {
                valor: 1000,
                data: new Date(),
                tipoMovimentacao: TIPO_MOVIMENTACAO.TRANSFERENCIA,
                numeroContaOrigem: 1,
                numeroContaDestino: 2,
            },
            'uuid',
        )

        expect(movimentacao).toBeDefined()
        expect(movimentacao.getValor()).toBe(1000)
        expect(movimentacao.getTipoMovimentacao()).toBe(TIPO_MOVIMENTACAO.TRANSFERENCIA)
    })

    it('deve lançar erro ao criar movimentação com valor inválido', () => {
        expect(() => {
            MovimentacaoFinanceira.criar({
                valor: -100,
                data: new Date(),
                tipoMovimentacao: TIPO_MOVIMENTACAO.SAQUE,
                numeroContaOrigem: 1,
            })
        }).toThrow(MovimentacaoFinanceiraException)
    })

    it('deve lançar erro ao criar movimentação com data futura', () => {
        expect(() => {
            MovimentacaoFinanceira.criar({
                valor: 500,
                data: new Date('2100-01-01'),
                tipoMovimentacao: TIPO_MOVIMENTACAO.DEPOSITO,
                numeroContaOrigem: 1,
            })
        }).toThrow(MovimentacaoFinanceiraException)
    })

    it('deve lançar erro ao criar movimentação com tipo de movimentação inválido', () => {
        expect(() => {
            MovimentacaoFinanceira.criar({
                valor: 200,
                data: new Date(),
                tipoMovimentacao: 'INVALIDO' as TIPO_MOVIMENTACAO,
                numeroContaOrigem: 1,
            })
        }).toThrow(MovimentacaoFinanceiraException)
    })

    it('deve lançar erro ao criar movimentação com numeroContaOrigem inválida', () => {
        expect(() => {
            MovimentacaoFinanceira.criar({
                valor: 200,
                data: new Date(),
                tipoMovimentacao: 'INVALIDO' as TIPO_MOVIMENTACAO,
                numeroContaOrigem: '1' as any,
            })
        }).toThrow(MovimentacaoFinanceiraException)
    })

    it('deve lançar erro ao criar movimentação com numeroContaDestino inválida', () => {
        expect(() => {
            MovimentacaoFinanceira.criar({
                valor: 200,
                data: new Date(),
                tipoMovimentacao: 'INVALIDO' as TIPO_MOVIMENTACAO,
                numeroContaDestino: '1' as any,
            })
        }).toThrow(MovimentacaoFinanceiraException)
    })

    it('deve lançar erro quando número de conta origem for inválido', () => {
        expect(() => {
            MovimentacaoFinanceira.criar({
                valor: 200,
                data: new Date(),
                tipoMovimentacao: TIPO_MOVIMENTACAO.DEPOSITO,
                numeroContaOrigem: -1,
            })
        }).toThrow(MovimentacaoFinanceiraException)
    })

    it('deve lançar erro quando número de conta destino for inválido', () => {
        expect(() => {
            MovimentacaoFinanceira.criar({
                valor: 300,
                data: new Date(),
                tipoMovimentacao: TIPO_MOVIMENTACAO.TRANSFERENCIA,
                numeroContaOrigem: 1,
                numeroContaDestino: -2,
            })
        }).toThrow(MovimentacaoFinanceiraException)
    })

    it('deve lançar erro ao validar o tipo de movimentação corretamente', () => {
        const movimentacao = MovimentacaoFinanceira.criar({
            valor: 1000,
            data: new Date(),
            tipoMovimentacao: TIPO_MOVIMENTACAO.DEPOSITO,
            numeroContaOrigem: 1,
        })

        expect(() => {
            movimentacao.validarTipoMovimentacao(TIPO_MOVIMENTACAO.TRANSFERENCIA)
        }).toThrow(TipoMovimetacaoInvalidoException)
    })

    it('não deve lançar erro ao validar o tipo de movimentação correto', () => {
        const movimentacao = MovimentacaoFinanceira.criar({
            valor: 500,
            data: new Date(),
            tipoMovimentacao: TIPO_MOVIMENTACAO.SAQUE,
            numeroContaOrigem: 1,
        })

        expect(() => {
            movimentacao.validarTipoMovimentacao(TIPO_MOVIMENTACAO.SAQUE)
        }).not.toThrow()
    })
})
