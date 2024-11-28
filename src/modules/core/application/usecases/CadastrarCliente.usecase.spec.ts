import { Test, TestingModule } from '@nestjs/testing'
import { CadastrarClienteUseCase } from './CadastrarCliente.usecase'
import { ClienteRepository } from '../../domain/repositories/Cliente.repository'
import { CadastrarClienteRequest } from '../requests/Cliente.request'
import { ClienteException } from '../../domain/exceptions/Cliente.exception'

const mockClienteRepository = {
    salvarCliente: jest.fn(),
}

describe('CadastrarClienteUseCase', () => {
    let useCase: CadastrarClienteUseCase
    let clienteRepository: ClienteRepository

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CadastrarClienteUseCase, { provide: 'ClienteRepository', useValue: mockClienteRepository }],
        }).compile()

        useCase = module.get<CadastrarClienteUseCase>(CadastrarClienteUseCase)
        clienteRepository = module.get<ClienteRepository>('ClienteRepository')
    })

    it('deve cadastrar um cliente com sucesso', async () => {
        const request: CadastrarClienteRequest = {
            nome: 'João Silva',
            cpf: '12345678901',
            dataNascimento: new Date('1990-01-01'),
            senha: 'Hudu*0101',
        }

        mockClienteRepository.salvarCliente.mockResolvedValue(null)

        const result = await useCase.execute(request)

        expect(clienteRepository.salvarCliente).toHaveBeenCalled()
        expect(result).toStrictEqual({
            nome: 'João Silva',
            cpf: '12345678901',
            dataNascimento: new Date('1990-01-01'),
            contas: [],
        })
    })

    it('deve lançar erro ao cadastrar cliente com dados inválidos(senha)', async () => {
        const request: CadastrarClienteRequest = {
            nome: 'João Silva',
            cpf: '12345678901',
            dataNascimento: new Date('1990-01-01'),
            senha: '12345',
        }

        await expect(useCase.execute(request)).rejects.toThrow(ClienteException)
    })

    it('deve lançar erro ao cadastrar cliente com dados inválidos(nome)', async () => {
        const request: CadastrarClienteRequest = {
            nome: 1 as any,
            cpf: '12345678901',
            dataNascimento: new Date('1990-01-01'),
            senha: 'Hudu*0101',
        }

        await expect(useCase.execute(request)).rejects.toThrow(ClienteException)
    })

    it('deve lançar erro ao cadastrar cliente com dados inválidos(cpf)', async () => {
        const request: CadastrarClienteRequest = {
            nome: 'João Silva',
            cpf: 1 as any,
            dataNascimento: new Date('1990-01-01'),
            senha: 'Hudu*0101',
        }

        await expect(useCase.execute(request)).rejects.toThrow(ClienteException)
    })

    it('deve lançar erro ao cadastrar cliente com dados inválidos(dataNascimento)', async () => {
        const request: CadastrarClienteRequest = {
            nome: 'João Silva',
            cpf: '12345678901',
            dataNascimento: "INVALIDO" as any,
            senha: 'Hudu*0101',
        }

        await expect(useCase.execute(request)).rejects.toThrow(ClienteException)
    })
})
