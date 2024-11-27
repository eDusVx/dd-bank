import { Body, Controller, Post } from '@nestjs/common'
import { EfetuarDepositoUseCase } from './application/usecases/EfetuarDeposito.usecase'

import { EfetuarSaqueUseCase } from './application/usecases/EfetuarSaque.usecase'
import { EfetuarTransferenciaUseCase } from './application/usecases/EfetuarTransferencia.usecase'
import { MovimentacaoFinanceiraDto } from './domain/MovimentacaoFinanceira'
import {
    EfeturarDepositoRequest,
    EfeturarSaqueRequest,
    EfeturarTransferenciaRequest,
} from './application/requests/MovimentacaoFinanceira.request'
import {
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOperation,
    ApiTags,
    ApiUnprocessableEntityResponse,
} from '@nestjs/swagger'

@ApiTags('Movimentacoes')
@Controller('movimentacoes')
export class MovimentacoesController {
    constructor(
        private readonly efetuarDepositoUseCase: EfetuarDepositoUseCase,
        private readonly efetuarSaqueUseCase: EfetuarSaqueUseCase,
        private readonly efetuarTransferenciaUseCase: EfetuarTransferenciaUseCase,
    ) {}

    @Post('deposito')
    @ApiOperation({ summary: 'Efetua um novo deposito em uma conta' })
    @ApiCreatedResponse({
        description: 'Retorno esperado do entpoint no caso de sucesso',
        example: {
            id: '667bcc43-11d3-49d2-8517-ef3bdc68f32a',
            valor: 1000.55,
            data: '2024-11-27T23:12:28.134Z',
            tipoMovimentacao: 'DEPOSITO',
            numeroContaDestino: 1,
        },
    })
    @ApiUnprocessableEntityResponse({
        description: 'Retorno esperado do endpoit no caso de tentativa de deposito em conta INATIVA',
        example: {
            message: 'A conta de número 1 precisa estar com status ATIVA para efetuar a operação DEPOSITO',
            error: 'StatusContaInvalidoEception',
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
    async efetuarDeposito(@Body() request: EfeturarDepositoRequest): Promise<MovimentacaoFinanceiraDto> {
        try {
            const response = await this.efetuarDepositoUseCase.execute(request)

            return response
        } catch (e) {
            throw e
        }
    }

    @Post('saque')
    @ApiOperation({ summary: 'Efetua um novo saque em uma conta' })
    @ApiCreatedResponse({
        description: 'Retorno esperado do entpoint no caso de sucesso',
        example: {
            id: '86f90a9d-7f42-481b-829c-2f27f3c7fe71',
            valor: 100,
            data: '2024-11-27T23:14:11.751Z',
            tipoMovimentacao: 'SAQUE',
            numeroContaOrigem: 1,
        },
    })
    @ApiUnprocessableEntityResponse({
        description: 'Retorno esperado do endpoit no caso de tentativa de deposito em conta INATIVA',
        content: {
            'application/json': {
                examples: {
                    contaInativa: {
                        summary: 'Conta INATIVA',
                        value: {
                            message: 'A conta de número 1 precisa estar com status ATIVA para efetuar a operação SAQUE',
                            error: 'StatusContaInvalidoEception',
                            statusCode: 422,
                        },
                    },
                    saldoInsuficiente: {
                        summary: 'Saldo insuficiente',
                        value: {
                            message: 'Saldo insuficiente para a transação SAQUE',
                            error: 'SaldoInsuficienteException',
                            statusCode: 422,
                        },
                    },
                },
            },
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
    async efetuarSaque(@Body() request: EfeturarSaqueRequest): Promise<MovimentacaoFinanceiraDto> {
        try {
            const response = await this.efetuarSaqueUseCase.execute(request)

            return response
        } catch (e) {
            throw e
        }
    }

    @Post('transferencia')
    @ApiOperation({ summary: 'Efetua uma transferencia de valores entre contas' })
    @ApiCreatedResponse({
        description: 'Retorno esperado do entpoint no caso de sucesso',
        example: {
            id: 'e27662d2-1d2f-4fe1-b43a-52c38d174c05',
            valor: 2000,
            data: '2024-11-27T23:13:20.532Z',
            tipoMovimentacao: 'TRANSFERENCIA',
            numeroContaOrigem: 1,
            numeroContaDestino: 2,
        },
    })
    @ApiUnprocessableEntityResponse({
        description: 'Retorno esperado do endpoit no caso de tentativa de deposito em conta INATIVA',
        content: {
            'application/json': {
                examples: {
                    contaInativa: {
                        summary: 'Conta INATIVA',
                        value: {
                            message:
                                'A conta de número 1 precisa estar com status ATIVA para efetuar a operação TRANSFERENCIA',
                            error: 'StatusContaInvalidoEception',
                            statusCode: 422,
                        },
                    },
                    saldoInsuficiente: {
                        summary: 'Saldo insuficiente',
                        value: {
                            message: 'Saldo insuficiente para a transação TRANSFERENCIA',
                            error: 'SaldoInsuficienteException',
                            statusCode: 422,
                        },
                    },
                },
            },
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
    async efetuarTransferencia(@Body() request: EfeturarTransferenciaRequest): Promise<MovimentacaoFinanceiraDto> {
        try {
            const response = await this.efetuarTransferenciaUseCase.execute(request)

            return response
        } catch (e) {
            throw e
        }
    }
}
