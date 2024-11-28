import { Test, TestingModule } from '@nestjs/testing'
import { CriarContaUseCase } from './CriarConta.usecase'
import { ContaRepository } from '../../domain/repositories/Conta.repository'
import { ClienteRepository } from '../../domain/repositories/Cliente.repository'
import { CriarContaRequest } from '../requests/Conta.request'
import { ClienteNaoEcontradoException } from '../../domain/exceptions/ClienteNaoEncontrado.exception'
import { ContaException } from '../../domain/exceptions/Conta.exception'

const mockContaRepository = {
    buscarProximoId: jest.fn(),
    salvarConta: jest.fn(),
}

const mockClienteRepository = {
    buscarPorId: jest.fn(),
}

describe('CriarContaUseCase', () => {
    let useCase: CriarContaUseCase
    let contaRepository: ContaRepository
    let clienteRepository: ClienteRepository

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CriarContaUseCase,
                { provide: 'ContaRepository', useValue: mockContaRepository },
                { provide: 'ClienteRepository', useValue: mockClienteRepository },
            ],
        }).compile()

        useCase = module.get<CriarContaUseCase>(CriarContaUseCase)
        contaRepository = module.get<ContaRepository>('ContaRepository')
        clienteRepository = module.get<ClienteRepository>('ClienteRepository')
    })

    it('deve criar uma conta com sucesso', async () => {
        const request: CriarContaRequest = {
            clienteId: '12345678901',
        }

        const clienteMock = {
            getCpf: jest.fn().mockReturnValue('12345678901'),
        }

        mockClienteRepository.buscarPorId.mockResolvedValue(clienteMock)
        mockContaRepository.buscarProximoId.mockResolvedValue(1)
        mockContaRepository.salvarConta.mockResolvedValue(null)

        const result = await useCase.execute(request)

        expect(clienteRepository.buscarPorId).toHaveBeenCalled()
        expect(contaRepository.buscarProximoId).toHaveBeenCalled()
        expect(contaRepository.salvarConta).toHaveBeenCalled()
        expect(result).toStrictEqual({
            clienteId: '12345678901',
            movimentacaoFinanceira: [],
            numeroConta: 1,
            saldo: 0,
            status: 'ATIVA',
        })
    })

    it('deve lançar erro se o cliente não for encontrado', async () => {
        const request: CriarContaRequest = {
            clienteId: '12345678901',
        }

        mockClienteRepository.buscarPorId.mockRejectedValue(
            new ClienteNaoEcontradoException(`Nenhum cliente com cpf 12345678901 foi encontrado`),
        )

        await expect(useCase.execute(request)).rejects.toThrow(ClienteNaoEcontradoException)
    })

    it('deve lançar erro se o numero da conta for invalido ', async () => {
        const request: CriarContaRequest = {
            clienteId: '12345678901',
        }

        const clienteMock = {
            getCpf: jest.fn().mockReturnValue('12345678901'),
        }

        mockClienteRepository.buscarPorId.mockResolvedValue(clienteMock)
        mockContaRepository.buscarProximoId.mockResolvedValue('INVALIDO')
        await expect(useCase.execute(request)).rejects.toThrow(ContaException)
    })
})
