import { Test, TestingModule } from '@nestjs/testing'
import { DadosNaoInformadosException } from '../../domain/exceptions/DadosNaoInformados.exception'
import { ContaRepository } from '../../domain/repositories/Conta.repository'
import { BuscarContasQuery } from './BuscarContas.query'
import { ContaNaoEncontradaException } from '../../domain/exceptions/ContaNaoEncontrada.exception'
import { ContaDto, STATUS_CONTA } from '../../domain/Conta'

const mockContaRepository = {
    buscarContaPorNumero: jest.fn(),
}

describe('BuscarContasQuery', () => {
    let buscarContasQuery: BuscarContasQuery
    let contaRepository: ContaRepository

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BuscarContasQuery, { provide: 'ContaRepository', useValue: mockContaRepository }],
        }).compile()

        buscarContasQuery = module.get<BuscarContasQuery>(BuscarContasQuery)
        contaRepository = module.get<ContaRepository>('ContaRepository')
    })

    it('deve lançar um erro se o numero da conta não for informado', async () => {
        await expect(buscarContasQuery.execute(null)).rejects.toThrow(DadosNaoInformadosException)
    })

    it('deve erro quando nenhuma conta for encontrada', async () => {
        mockContaRepository.buscarContaPorNumero.mockRejectedValue(
            new ContaNaoEncontradaException(`Nenhuma conta com o número 1 foi encontrada`),
        )

        await expect(buscarContasQuery.execute(1)).rejects.toThrow(ContaNaoEncontradaException)
    })

    it('deve retornar um DTO de conta quando uma conta for encontrada', async () => {
        const mockContasDto: ContaDto = {
            clienteId: '12345678901',
            movimentacaoFinanceira: [],
            numeroConta: 1,
            saldo: 100,
            status: STATUS_CONTA.ATIVA,
        }

        mockContaRepository.buscarContaPorNumero.mockResolvedValue({
            toDTO: jest.fn().mockReturnValue(mockContasDto),
        })

        const result = await buscarContasQuery.execute(1)

        expect(result).toEqual(mockContasDto)
        expect(contaRepository.buscarContaPorNumero).toHaveBeenCalledWith(1)
    })
})
