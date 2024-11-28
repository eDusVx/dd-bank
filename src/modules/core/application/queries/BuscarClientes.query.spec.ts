import { Test, TestingModule } from '@nestjs/testing'
import { ClienteRepository } from '../../domain/repositories/Cliente.repository'
import { DadosNaoInformadosException } from '../../domain/exceptions/DadosNaoInformados.exception'
import { ClienteDto } from '../../domain/Cliente'
import { BuscarClientesQuery } from './BuscarClientes.query'
import { ClienteNaoEcontradoException } from '../../domain/exceptions/ClienteNaoEncontrado.exception'

const mockClienteRepository = {
    buscarPorId: jest.fn(),
}

describe('BuscarClientesQuery', () => {
    let buscarClientesQuery: BuscarClientesQuery
    let clienteRepository: ClienteRepository

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BuscarClientesQuery, { provide: 'ClienteRepository', useValue: mockClienteRepository }],
        }).compile()

        buscarClientesQuery = module.get<BuscarClientesQuery>(BuscarClientesQuery)
        clienteRepository = module.get<ClienteRepository>('ClienteRepository')
    })

    it('deve lançar um erro se o CPF não for informado', async () => {
        await expect(buscarClientesQuery.execute('')).rejects.toThrow(DadosNaoInformadosException)
    })

    it('deve erro quando nenhum cliente for encontrado', async () => {
        mockClienteRepository.buscarPorId.mockRejectedValue(
            new ClienteNaoEcontradoException(`Nenhum cliente com cpf 12345678901 foi encontrado`),
        )

        await expect(buscarClientesQuery.execute('12345678901')).rejects.toThrow(ClienteNaoEcontradoException)
    })

    it('deve retornar um DTO de cliente quando um cliente for encontrado', async () => {
        const mockClientesDto: ClienteDto = {
            nome: 'Cliente Teste 1',
            cpf: '12345678901',
            contas: [],
            dataNascimento: new Date('2001-11-25'),
        }

        mockClienteRepository.buscarPorId.mockResolvedValue({
            toDTO: jest.fn().mockReturnValue(mockClientesDto),
        })

        const result = await buscarClientesQuery.execute('12345678901')

        expect(result).toEqual(mockClientesDto)
        expect(clienteRepository.buscarPorId).toHaveBeenCalledWith('12345678901')
    })
})
