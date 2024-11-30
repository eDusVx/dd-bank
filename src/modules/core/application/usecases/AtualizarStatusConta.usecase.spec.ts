import { Test, TestingModule } from '@nestjs/testing'
import { ContaRepository } from '../../domain/repositories/Conta.repository'
import { Conta, STATUS_CONTA } from '../../domain/Conta'
import { AtualizarStatusContaUseCase } from './AualizarStatusConta.usecase'
import { ContaNaoEncontradaException } from '../../domain/exceptions/ContaNaoEncontrada.exception'
import { MesmoStatusContaException } from '../../domain/exceptions/MesmoStatusConta.exception'

const mockContaRepository = {
    buscarContaPorNumero: jest.fn(),
    salvarConta: jest.fn(),
}

describe('AtualizarStatusContaUseCase', () => {
    let useCase: AtualizarStatusContaUseCase
    let contaRepository: ContaRepository

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AtualizarStatusContaUseCase, { provide: 'ContaRepository', useValue: mockContaRepository }],
        }).compile()

        useCase = module.get<AtualizarStatusContaUseCase>(AtualizarStatusContaUseCase)
        contaRepository = module.get<ContaRepository>('ContaRepository')
    })

    it('deve atualizar o status da conta com sucesso', async () => {
        const request = { numeroConta: 12345, status: STATUS_CONTA.ATIVA }
        const contaMock = {
            atualizarStatus: jest.fn(),
            toDTO: jest.fn().mockReturnValue({
                clienteId: '12345678901',
                movimentacaoFinanceira: [],
                numeroConta: 12345,
                saldo: 100,
                status: STATUS_CONTA.ATIVA,
            }),
        }

        mockContaRepository.buscarContaPorNumero.mockResolvedValue(contaMock)
        mockContaRepository.salvarConta.mockResolvedValue(undefined)

        const result = await useCase.execute(request)

        expect(contaRepository.buscarContaPorNumero).toHaveBeenCalledWith(request.numeroConta)
        expect(contaMock.atualizarStatus).toHaveBeenCalledWith(STATUS_CONTA[request.status])
        expect(contaRepository.salvarConta).toHaveBeenCalledWith(contaMock)
        expect(result).toEqual({
            clienteId: '12345678901',
            movimentacaoFinanceira: [],
            numeroConta: 12345,
            saldo: 100,
            status: STATUS_CONTA.ATIVA,
        })
    })

    it('deve retornar erro ao tentar atualizar para o mesmo status da conta', async () => {
        const request = { numeroConta: 12345, status: STATUS_CONTA.ATIVA }
        const props = {
            clienteId: '12345678901',
            saldo: 100,
            status: STATUS_CONTA.ATIVA,
            movimentacaoFinanceira: [],
        }
        const conta = Conta.carregar(props, 12345)

        mockContaRepository.buscarContaPorNumero.mockResolvedValue(conta)
        mockContaRepository.salvarConta.mockResolvedValue(undefined)

        await expect(useCase.execute(request)).rejects.toThrow(MesmoStatusContaException)
    })

    it('deve lançar erro se a conta não for encontrada', async () => {
        const request = { numeroConta: 12345, status: STATUS_CONTA.ATIVA }

        mockContaRepository.buscarContaPorNumero.mockRejectedValue(
            new ContaNaoEncontradaException(`Nenhuma conta com o número 12345 foi encontrada`),
        )

        await expect(useCase.execute(request)).rejects.toThrow(ContaNaoEncontradaException)
    })

    it('deve lançar erro ao tentar salvar a conta', async () => {
        const request = { numeroConta: 12345, status: STATUS_CONTA.ATIVA }
        const contaMock = {
            atualizarStatus: jest.fn(),
            toDTO: jest.fn().mockReturnValue({ numeroConta: 12345, status: STATUS_CONTA.ATIVA }),
        }

        mockContaRepository.buscarContaPorNumero.mockResolvedValue(contaMock)
        mockContaRepository.salvarConta.mockRejectedValue(new Error('Erro ao salvar a conta'))

        await expect(useCase.execute(request)).rejects.toThrow(Error)
    })
})
