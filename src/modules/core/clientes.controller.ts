import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { CadastrarClienteUseCase } from './application/usecases/CadastrarCliente.usecase'
import { BuscarClientesQuery } from './application/queries/BuscarClientes.query'
import { CadastrarClienteRequest } from './application/requests/Cliente.request'
import { ClienteDto } from './domain/Cliente'
import {
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnprocessableEntityResponse,
} from '@nestjs/swagger'

@ApiTags('Clientes')
@Controller('clientes')
export class ClientesController {
    constructor(
        private readonly cadastrarClienteUseCase: CadastrarClienteUseCase,
        private readonly buscarClientesQuery: BuscarClientesQuery,
    ) {}

    @Post('')
    @ApiOperation({ summary: 'Cadastra um novo cliente no sistema' })
    @ApiCreatedResponse({
        description: 'Retorno esperado do endpoint em caso de sucesso',
        example: {
            cpf: '00000000010',
            nome: 'eduardo',
            dataNascimento: '2000-05-12T00:00:00.000Z',
            contas: [],
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
                            error: 'ClienteException',
                            statusCode: 422,
                        },
                    },
                    nomeInvalido: {
                        summary: 'Nome do cliente inválido',
                        value: {
                            message: 'O nome do cliente não pode ser nulo',
                            error: 'ClienteException',
                            statusCode: 422,
                        },
                    },
                    dataInvalida: {
                        summary: 'Data de nascimento inválida',
                        value: {
                            message: 'A data de nascimento deve ser anterior à data atual.',
                            error: 'ClienteException',
                            statusCode: 422,
                        },
                    },
                },
            },
        },
    })
    async cadastrarCliente(@Body() request: CadastrarClienteRequest): Promise<ClienteDto> {
        try {
            const response = await this.cadastrarClienteUseCase.execute(request)

            return response
        } catch (e) {
            throw e
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Busca um cliente no sistema' })
    @ApiOkResponse({
        description: 'Retorno esperado do endpoint em caso de sucesso',
        example: {
            cpf: '00000000002',
            nome: 'eduardo',
            dataNascimento: '2000-05-12T03:00:00.000Z',
            contas: [3, 4, 5, 6, 7],
        },
    })
    @ApiNotFoundResponse({
        description: 'Retorno esperado do endpoint em caso de não existir um cliente com o cpf passado',
        example: {
            message: 'Nenhum cliente com cpf 00000000020 foi encontrado',
            error: 'ClienteNaoEcontradoException',
            statusCode: 404,
        },
    })
    async buscarClientes(@Param('id') id: string): Promise<ClienteDto | ClienteDto[]> {
        try {
            const response = await this.buscarClientesQuery.execute(id)

            return response
        } catch (e) {
            throw e
        }
    }
}
