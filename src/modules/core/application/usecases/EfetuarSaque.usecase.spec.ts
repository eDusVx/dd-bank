import { Test, TestingModule } from '@nestjs/testing'
import { ContaRepository } from '../../domain/repositories/Conta.repository'
import { TIPO_MOVIMENTACAO } from '../../domain/MovimentacaoFinanceira'
import { EfeturarSaqueRequest } from '../requests/MovimentacaoFinanceira.request'
import { ContaNaoEncontradaException } from '../../domain/exceptions/ContaNaoEncontrada.exception'
import { StatusContaInvalidoEception } from '../../domain/exceptions/StatusContaInvalido.exception'
import { Conta, STATUS_CONTA } from '../../domain/Conta'
import { EfetuarSaqueUseCase } from './EfetuarSaque.usecase'
import { SaldoInsuficienteException } from '../../domain/exceptions/SaldoInsuficiente.exception'

const mockContaRepository = {
    buscarContaPorNumero: jest.fn(),
    salvarConta: jest.fn(),
}

describe('EfetuarSaqueUseCase', () => {
    let useCase: EfetuarSaqueUseCase
    let contaRepository: ContaRepository

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [EfetuarSaqueUseCase, { provide: 'ContaRepository', useValue: mockContaRepository }],
        }).compile()

        useCase = module.get<EfetuarSaqueUseCase>(EfetuarSaqueUseCase)
        contaRepository = module.get<ContaRepository>('ContaRepository')
    })

    it('deve efetuar um saque com sucesso', async () => {
        const request: EfeturarSaqueRequest = {
            numeroContaOrigem: 1,
            valor: 500,
        }

        const props = {
            clienteId: '12345678901',
            status: STATUS_CONTA.ATIVA,
            saldo: 500,
            movimentacaoFinanceira: [],
        }

        const contaOrigemMock = Conta.carregar(props, 1)

        mockContaRepository.buscarContaPorNumero.mockResolvedValue(contaOrigemMock)
        mockContaRepository.salvarConta.mockResolvedValue(undefined)

        const result = await useCase.execute(request)

        expect(contaRepository.buscarContaPorNumero).toHaveBeenCalledWith(request.numeroContaOrigem)
        expect(contaRepository.salvarConta).toHaveBeenCalled()
        expect(result.valor).toEqual(500)
        expect(result.tipoMovimentacao).toEqual(TIPO_MOVIMENTACAO.SAQUE)
        expect(result.numeroContaOrigem).toEqual(1)
        expect(contaOrigemMock.getSaldo()).toEqual(0)
    })

    it('deve lançar erro se não houver saldo suficiente para o saque', async () => {
        const request: EfeturarSaqueRequest = {
            numeroContaOrigem: 1,
            valor: 500,
        }

        const props = {
            clienteId: '12345678901',
            status: STATUS_CONTA.ATIVA,
            saldo: 300,
            movimentacaoFinanceira: [],
        }

        const conta = Conta.carregar(props, 1)

        mockContaRepository.buscarContaPorNumero.mockResolvedValue(conta)

        await expect(useCase.execute(request)).rejects.toThrow(SaldoInsuficienteException)
    })

    it('deve lançar erro se a conta não for encontrada', async () => {
        const request: EfeturarSaqueRequest = {
            numeroContaOrigem: 1,
            valor: 500,
        }

        mockContaRepository.buscarContaPorNumero.mockRejectedValue(
            new ContaNaoEncontradaException(`Nenhuma conta com o número 1 foi encontrada`),
        )

        await expect(useCase.execute(request)).rejects.toThrow(ContaNaoEncontradaException)
    })

    it('deve lançar erro se o status da conta não permitir o saque', async () => {
        const request: EfeturarSaqueRequest = {
            numeroContaOrigem: 1,
            valor: 500,
        }

        const props = {
            clienteId: '12345678901',
            status: STATUS_CONTA.INATIVA,
            saldo: 0,
            movimentacaoFinanceira: [],
        }
        const conta = Conta.carregar(props, 1)

        mockContaRepository.buscarContaPorNumero.mockResolvedValue(conta)

        await expect(useCase.execute(request)).rejects.toThrow(StatusContaInvalidoEception)
    })
})
