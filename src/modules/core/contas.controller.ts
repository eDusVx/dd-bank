import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { AtualizarStatusContaRequest, CriarContaRequest } from './application/requests/Conta.request'
import { CriarContaUseCase } from './application/usecases/CriarConta.usecase'
import { AtualizarStatusContaUseCase } from './application/usecases/AualizarStatusConta.usecase'
import { BuscarContasQuery } from './application/queries/BuscarContas.query'
import { ContaDto } from './domain/Conta'
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnprocessableEntityResponse,
} from '@nestjs/swagger'
import { AuthGuard } from '../shared/guards/Auth.guard'

@ApiTags('Contas')
@Controller('contas')
export class ContasController {
    constructor(
        private readonly criarContaUseCase: CriarContaUseCase,
        private readonly atualizarStatusContaUseCase: AtualizarStatusContaUseCase,
        private readonly buscarContasQuery: BuscarContasQuery,
    ) {}

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Post('')
    @ApiOperation({ summary: 'Cadastra uma nova conta no sistema' })
    @ApiCreatedResponse({
        description: 'Retorno esperado do endpoint em caso de sucesso',
        example: {
            numeroConta: 24,
            saldo: 0,
            status: 'ATIVA',
            clienteId: '00000000000',
            movimentacaoFinanceira: [],
        },
    })
    @ApiUnprocessableEntityResponse({
        description: 'Retorno esperado do endpoint em caso de dados inválidos',
        content: {
            'application/json': {
                examples: {
                    cpfInvalido: {
                        summary: 'CPF inválido',
                        value: {
                            message: 'O cpf do cliente deve ter 11 dígitos.',
                            error: 'ContaException',
                            statusCode: 422,
                        },
                    },
                    cpfNulo: {
                        summary: 'CPF nulo',
                        value: {
                            message: 'O cpf do cliente não pode ser nulo',
                            error: 'ContaException',
                            statusCode: 422,
                        },
                    },
                },
            },
        },
    })
    @ApiNotFoundResponse({
        description: 'Retorno do endpoint no casso de criação de conta para um cliente que não existe',
        example: {
            message: 'Nenhum cliente com cpf 00000000018 foi encontrado',
            error: 'ClienteNaoEcontradoException',
            statusCode: 404,
        },
    })
    async criarConta(@Body() request: CriarContaRequest): Promise<ContaDto> {
        try {
            const response = await this.criarContaUseCase.execute(request)

            return response
        } catch (e) {
            throw e
        }
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Get(':id')
    @ApiOperation({ summary: 'Busca uma conta no sistema' })
    @ApiOkResponse({
        description: 'Retorno esperado do endpoint em caso de sucesso',
        example: {
            numeroConta: 2,
            saldo: 3700.55,
            status: 'ATIVA',
            clienteId: '00000000001',
            movimentacaoFinanceira: [
                {
                    id: '4cfbe396-54dd-4fe1-9982-97346c1f6889',
                    valor: 700,
                    data: '2024-11-27T21:48:46.596Z',
                    tipoMovimentacao: 'TRANSFERENCIA',
                    numeroContaOrigem: 1,
                    numeroContaDestino: 2,
                },
                {
                    id: 'b47ddb01-06d7-4858-ab9e-8bc0b16210a1',
                    valor: 2000,
                    data: '2024-11-27T21:48:52.380Z',
                    tipoMovimentacao: 'TRANSFERENCIA',
                    numeroContaOrigem: 1,
                    numeroContaDestino: 2,
                },
                {
                    id: '53b71404-1b55-40c6-8c04-8d5d9f1b1087',
                    valor: 1000.55,
                    data: '2024-11-27T21:48:58.067Z',
                    tipoMovimentacao: 'DEPOSITO',
                    numeroContaDestino: 2,
                },
            ],
        },
    })
    @ApiNotFoundResponse({
        description: 'Retorno esperado do endpoint em caso de não existir uma conta com o id passado',
        example: {
            message: 'Nenhuma conta com o número 90 foi encontrada',
            error: 'ContaNaoEncontradaException',
            statusCode: 404,
        },
    })
    async buscarContas(@Param('id') id: number): Promise<ContaDto> {
        try {
            const response = await this.buscarContasQuery.execute(id)

            return response
        } catch (e) {
            throw e
        }
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Patch(':id')
    @ApiOperation({ summary: 'Atualiza o status de uma conta existente' })
    @ApiOkResponse({
        description: 'Retorno esperado do endpoint em caso de sucesso',
        example: {
            numeroConta: 2,
            saldo: 3700.55,
            status: 'ATIVA',
            clienteId: '00000000001',
            movimentacaoFinanceira: [
                {
                    id: '4cfbe396-54dd-4fe1-9982-97346c1f6889',
                    valor: 700,
                    data: '2024-11-27T21:48:46.596Z',
                    tipoMovimentacao: 'TRANSFERENCIA',
                    numeroContaOrigem: 1,
                    numeroContaDestino: 2,
                },
                {
                    id: 'b47ddb01-06d7-4858-ab9e-8bc0b16210a1',
                    valor: 2000,
                    data: '2024-11-27T21:48:52.380Z',
                    tipoMovimentacao: 'TRANSFERENCIA',
                    numeroContaOrigem: 1,
                    numeroContaDestino: 2,
                },
                {
                    id: '53b71404-1b55-40c6-8c04-8d5d9f1b1087',
                    valor: 1000.55,
                    data: '2024-11-27T21:48:58.067Z',
                    tipoMovimentacao: 'DEPOSITO',
                    numeroContaDestino: 2,
                },
            ],
        },
    })
    @ApiUnprocessableEntityResponse({
        description: 'Retorno esperado do endpoint em caso de dados inválidos',
        example: {
            message: 'O novo status de conta informado é inválido deve ser ATIVA ou INATIVA',
            error: 'StatusContaInexistenteException',
            statusCode: 422,
        },
    })
    @ApiUnprocessableEntityResponse({
        description: 'Retorno esperado do endpoint em caso de o status conta já ser o mesmo a ser alterado',
        example: {
            message: 'O status da conta já é ATIVA',
            error: 'MesmoStatusContaException',
            statusCode: 422,
        },
    })
    @ApiNotFoundResponse({
        description: 'Retorno esperado do endpoint em caso de conta não encontrada',
        example: {
            message: 'Nenhuma conta com o número 90 foi encontrada',
            error: 'ContaNaoEncontradaException',
            statusCode: 404,
        },
    })
    async atualizarStatusConta(
        @Param('id') id: number,
        @Body() atualizarStatusContaDto: AtualizarStatusContaRequest,
    ): Promise<ContaDto> {
        try {
            const response = await this.atualizarStatusContaUseCase.execute({
                numeroConta: id,
                ...atualizarStatusContaDto,
            })

            return response
        } catch (e) {
            throw e
        }
    }
}
