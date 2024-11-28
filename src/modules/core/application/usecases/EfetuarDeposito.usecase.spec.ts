import { Test, TestingModule } from '@nestjs/testing'
import { EfetuarDepositoUseCase } from './EfetuarDeposito.usecase'
import { ContaRepository } from '../../domain/repositories/Conta.repository'
import { TIPO_MOVIMENTACAO } from '../../domain/MovimentacaoFinanceira'
import { EfeturarDepositoRequest } from '../requests/MovimentacaoFinanceira.request'
import { ContaNaoEncontradaException } from '../../domain/exceptions/ContaNaoEncontrada.exception'
import { StatusContaInvalidoEception } from '../../domain/exceptions/StatusContaInvalido.exception'
import { Conta, STATUS_CONTA } from '../../domain/Conta'

const mockContaRepository = {
    buscarContaPorNumero: jest.fn(),
    salvarConta: jest.fn(),
}

describe('EfetuarDepositoUseCase', () => {
    let useCase: EfetuarDepositoUseCase
    let contaRepository: ContaRepository

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [EfetuarDepositoUseCase, { provide: 'ContaRepository', useValue: mockContaRepository }],
        }).compile()

        useCase = module.get<EfetuarDepositoUseCase>(EfetuarDepositoUseCase)
        contaRepository = module.get<ContaRepository>('ContaRepository')
    })

    it('deve efetuar um depósito com sucesso', async () => {
        const request: EfeturarDepositoRequest = {
            numeroContaDestino: 1,
            valor: 1000,
        }

        const props = {
            clienteId: '12345678901',
            status: STATUS_CONTA.ATIVA,
            saldo: 500,
            movimentacaoFinanceira: [],
        }

        const contaMock = Conta.carregar(props, 1)

        mockContaRepository.buscarContaPorNumero.mockResolvedValue(contaMock)

        mockContaRepository.salvarConta.mockResolvedValue(contaMock)

        const result = await useCase.execute(request)

        expect(contaRepository.buscarContaPorNumero).toHaveBeenCalledWith(request.numeroContaDestino)
        expect(contaRepository.salvarConta).toHaveBeenCalled()
        expect(result.valor).toEqual(1000)
        expect(result.tipoMovimentacao).toEqual(TIPO_MOVIMENTACAO.DEPOSITO)
        expect(result.numeroContaDestino).toEqual(1)
        expect(contaMock.getSaldo()).toBe(1500)
    })

    it('deve lançar erro se a conta não for encontrada', async () => {
        const request: EfeturarDepositoRequest = {
            numeroContaDestino: 1,
            valor: 1000,
        }

        mockContaRepository.buscarContaPorNumero.mockRejectedValue(
            new ContaNaoEncontradaException(`Nenhuma conta com o número 1 foi encontrada`),
        )

        await expect(useCase.execute(request)).rejects.toThrow(ContaNaoEncontradaException)
    })

    it('deve lançar erro se o status da conta não permitir o depósito', async () => {
        const request: EfeturarDepositoRequest = {
            numeroContaDestino: 1,
            valor: 1000,
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
