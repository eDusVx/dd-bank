import { Body, Controller, Post } from '@nestjs/common'
import { EfetuarDepositoUseCase } from './application/usecases/EfetuarDeposito.usecase'
import { EfeturarDepositoDto, EfeturarSaqueDto, EfeturarTransferenciaDto, MovimentacaoFinanceiraDto } from './domain/dto/MovimentacaoFinanceira.dto'
import { EfetuarSaqueUseCase } from './application/usecases/EfetuarSaque.usecase'
import { EfetuarTransferenciaUseCase } from './application/usecases/EfetuarTransferencia.usecase'

@Controller('movimentacoes')
export class MovimentacoesController {
    constructor(
        private readonly efetuarDepositoUseCase: EfetuarDepositoUseCase,
        private readonly efetuarSaqueUseCase: EfetuarSaqueUseCase,
        private readonly efetuarTransferenciaUseCase: EfetuarTransferenciaUseCase,
    ) {}

    @Post('deposito')
    async efetuarDeposito(@Body() request: EfeturarDepositoDto): Promise<MovimentacaoFinanceiraDto> {
        try {
            const response = await this.efetuarDepositoUseCase.execute(request)

            return response
        } catch (e) {
            throw e
        }
    }

    @Post('saque')
    async efetuarSaque(@Body() request: EfeturarSaqueDto): Promise<MovimentacaoFinanceiraDto> {
        try {
            const response = await this.efetuarSaqueUseCase.execute(request)

            return response
        } catch (e) {
            throw e
        }
    }

    @Post('transferencia')
    async efetuarTransferencia(@Body() request: EfeturarTransferenciaDto): Promise<MovimentacaoFinanceiraDto> {
        try {
            const response = await this.efetuarTransferenciaUseCase.execute(request)

            return response
        } catch (e) {
            throw e
        }
    }
}
