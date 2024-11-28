import { Test, TestingModule } from '@nestjs/testing'
import { DadosNaoInformadosException } from '../../domain/exceptions/DadosNaoInformados.exception'
import { EfetuarLoginClienteUseCase } from './EfetuarLoginCliente.usecase'
import { SenhaInvalidaException } from '../../domain/exceptions/SenhaInvalida.excpetion'
import { ClienteNaoEcontradoException } from '../../domain/exceptions/ClienteNaoEncontrado.exception'

const clienteRepositoryMock = {
    buscarPorId: jest.fn(),
}
const authServiceMock = {
    generateJwt: jest.fn(),
}

describe('EfetuarLoginClienteUseCase', () => {
    let useCase: EfetuarLoginClienteUseCase

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EfetuarLoginClienteUseCase,
                { provide: 'ClienteRepository', useValue: clienteRepositoryMock },
                { provide: 'AuthService', useValue: authServiceMock },
            ],
        }).compile()

        useCase = module.get<EfetuarLoginClienteUseCase>(EfetuarLoginClienteUseCase)
    })

    it('Deve retornar erro caso o cpf não seja passado', async () => {
        const request = { cpf: '', senha: 'senha' }

        await expect(useCase.execute(request)).rejects.toThrowError(
            new DadosNaoInformadosException('O  cpf deve ser informado'),
        )
    })

    it('Deve retornar um jwt token em caso de sucesso', async () => {
        const request = { cpf: '12345678900', senha: 'senha' }
        const clienteMock = {
            verificarSenha: jest.fn(),
            getCpf: jest.fn().mockReturnValue('12345678900'),
        }

        clienteRepositoryMock.buscarPorId.mockResolvedValue(clienteMock)
        authServiceMock.generateJwt.mockResolvedValue('jwt-token')

        const result = await useCase.execute(request)

        expect(clienteRepositoryMock.buscarPorId).toHaveBeenCalledWith(request.cpf)
        expect(clienteMock.verificarSenha).toHaveBeenCalledWith(request.senha)
        expect(authServiceMock.generateJwt).toHaveBeenCalledWith(clienteMock.getCpf())
        expect(result.token).toBe('jwt-token')
    })

    it('Deve retornar erro no caso de nenhum cliente encontrado', async () => {
        const request = { cpf: '12345678900', senha: 'senha' }

        clienteRepositoryMock.buscarPorId.mockRejectedValue(
            new ClienteNaoEcontradoException(`Nenhum cliente com cpf 12345678900 foi encontrado`),
        )

        await expect(useCase.execute(request)).rejects.toThrow(ClienteNaoEcontradoException)
    })

    it('deve retornar erro caso a senha esteja incorreta', async () => {
        const request = { cpf: '12345678900', senha: 'senhaErrada' }
        const clienteMock = {
            verificarSenha: jest.fn().mockImplementation(() => {
                throw new SenhaInvalidaException('A senha do cliente está incorreta')
            }),
            getCpf: jest.fn().mockReturnValue('12345678900'),
        }

        clienteRepositoryMock.buscarPorId.mockResolvedValue(clienteMock)

        await expect(useCase.execute(request)).rejects.toThrow(SenhaInvalidaException)
    })
})
