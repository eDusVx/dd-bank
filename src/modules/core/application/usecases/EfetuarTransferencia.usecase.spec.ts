import { Test, TestingModule } from '@nestjs/testing'
import { ContaRepository } from '../../domain/repositories/Conta.repository'
import { TIPO_MOVIMENTACAO } from '../../domain/MovimentacaoFinanceira'
import { EfeturarTransferenciaRequest } from '../requests/MovimentacaoFinanceira.request'
import { ContaNaoEncontradaException } from '../../domain/exceptions/ContaNaoEncontrada.exception'
import { StatusContaInvalidoEception } from '../../domain/exceptions/StatusContaInvalido.exception'
import { EfetuarTransferenciaUseCase } from './EfetuarTransferencia.usecase'
import { Conta, STATUS_CONTA } from '../../domain/Conta'
import { SaldoInsuficienteException } from '../../domain/exceptions/SaldoInsuficiente.exception'
import { MesmaContaTransferenciaException } from '../../domain/exceptions/MesmaContaTransferencia.exception'

const mockContaRepository = {
    buscarContaPorNumero: jest.fn(),
    salvarContas: jest.fn(),
}

describe('EfetuarTransferenciaUseCase', () => {
    let useCase: EfetuarTransferenciaUseCase
    let contaRepository: ContaRepository

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [EfetuarTransferenciaUseCase, { provide: 'ContaRepository', useValue: mockContaRepository }],
        }).compile()

        useCase = module.get<EfetuarTransferenciaUseCase>(EfetuarTransferenciaUseCase)
        contaRepository = module.get<ContaRepository>('ContaRepository')
    })

    it('deve efetuar uma transferência com sucesso', async () => {
        const request: EfeturarTransferenciaRequest = {
            numeroContaOrigem: 1,
            numeroContaDestino: 2,
            valor: 500,
        }

        const props = {
            clienteId: '12345678901',
            status: STATUS_CONTA.ATIVA,
            saldo: 500,
            movimentacaoFinanceira: [],
        }

        const contaOrigemMock = Conta.carregar(props, 1)

        const contaDestinoMock = Conta.carregar(props, 2)

        mockContaRepository.buscarContaPorNumero
            .mockResolvedValueOnce(contaOrigemMock)
            .mockResolvedValueOnce(contaDestinoMock)

        mockContaRepository.salvarContas.mockResolvedValue(undefined)

        const result = await useCase.execute(request)

        expect(contaRepository.buscarContaPorNumero).toHaveBeenCalled()
        expect(contaRepository.buscarContaPorNumero).toHaveBeenCalled()
        expect(contaRepository.salvarContas).toHaveBeenCalled()
        expect(result.valor).toEqual(500)
        expect(result.tipoMovimentacao).toEqual(TIPO_MOVIMENTACAO.TRANSFERENCIA)
        expect(result.numeroContaOrigem).toEqual(1)
        expect(result.numeroContaDestino).toEqual(2)
        expect(contaOrigemMock.getSaldo()).toEqual(0)
        expect(contaDestinoMock.getSaldo()).toEqual(1000)
    })

    it('deve retornar erro ao tentarefetuar uma transferencia para a mesma conta', async () => {
        const request: EfeturarTransferenciaRequest = {
            numeroContaOrigem: 1,
            numeroContaDestino: 1,
            valor: 500,
        }

        const props = {
            clienteId: '12345678901',
            status: STATUS_CONTA.ATIVA,
            saldo: 500,
            movimentacaoFinanceira: [],
        }

        const contaOrigemMock = Conta.carregar(props, 1)

        mockContaRepository.buscarContaPorNumero
            .mockResolvedValueOnce(contaOrigemMock)
            .mockResolvedValueOnce(contaOrigemMock)

        mockContaRepository.salvarContas.mockResolvedValue(undefined)

        await expect(useCase.execute(request)).rejects.toThrow(MesmaContaTransferenciaException)
    })

    it('deve lançar erro se a conta de origem não tiver saldo suficiente para a transferência', async () => {
        const request: EfeturarTransferenciaRequest = {
            numeroContaOrigem: 1,
            numeroContaDestino: 2,
            valor: 500,
        }

        const propsContaOrigem = {
            clienteId: '12345678901',
            status: STATUS_CONTA.ATIVA,
            saldo: 300,
            movimentacaoFinanceira: [],
        }

        const propsContaDestino = {
            clienteId: '98765432109',
            status: STATUS_CONTA.ATIVA,
            saldo: 1000,
            movimentacaoFinanceira: [],
        }

        const contaOrigemMock = Conta.carregar(propsContaOrigem, 1)
        const contaDestinoMock = Conta.carregar(propsContaDestino, 2)

        mockContaRepository.buscarContaPorNumero
            .mockResolvedValueOnce(contaOrigemMock)
            .mockResolvedValueOnce(contaDestinoMock)

        await expect(useCase.execute(request)).rejects.toThrow(SaldoInsuficienteException)
    })

    it('deve lançar erro se a conta de origem não for encontrada', async () => {
        const request: EfeturarTransferenciaRequest = {
            numeroContaOrigem: 1,
            numeroContaDestino: 2,
            valor: 500,
        }

        mockContaRepository.buscarContaPorNumero.mockRejectedValueOnce(
            new ContaNaoEncontradaException(`Nenhuma conta com o número ${request.numeroContaOrigem} foi encontrada`),
        )

        await expect(useCase.execute(request)).rejects.toThrow(ContaNaoEncontradaException)
    })

    it('deve lançar erro se a conta de destino não for encontrada', async () => {
        const request: EfeturarTransferenciaRequest = {
            numeroContaOrigem: 1,
            numeroContaDestino: 2,
            valor: 500,
        }

        mockContaRepository.buscarContaPorNumero
            .mockResolvedValueOnce({ validarStatusConta: jest.fn() })
            .mockRejectedValueOnce(
                new ContaNaoEncontradaException(
                    `Nenhuma conta com o número ${request.numeroContaDestino} foi encontrada`,
                ),
            )

        await expect(useCase.execute(request)).rejects.toThrow(ContaNaoEncontradaException)
    })

    it('deve lançar erro se o status da conta de origem for inválido', async () => {
        const request: EfeturarTransferenciaRequest = {
            numeroContaOrigem: 1,
            numeroContaDestino: 2,
            valor: 500,
        }

        const contaOrigemMock = {
            validarStatusConta: jest.fn(() => {
                throw new StatusContaInvalidoEception('Status inválido para transferência')
            }),
        }

        mockContaRepository.buscarContaPorNumero
            .mockResolvedValueOnce(contaOrigemMock)
            .mockResolvedValueOnce({ validarStatusConta: jest.fn() })

        await expect(useCase.execute(request)).rejects.toThrow(StatusContaInvalidoEception)
    })
})
