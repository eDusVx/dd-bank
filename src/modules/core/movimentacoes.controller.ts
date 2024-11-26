import { Body, Controller, Post } from '@nestjs/common'
import { EfetuarDepositoUseCase } from './application/usecases/EfetuarDepositoUseCase.usecase'
import { EfeturarDepositoDto, MovimentacaoFinanceiraDto } from './domain/dto/MovimentacaoFinanceira.dto'

@Controller('movimentacoes')
export class MovimentacoesController {
    constructor(private readonly efetuarDepositoUseCase: EfetuarDepositoUseCase) {}

    @Post('deposito')
    async efetuarMovimentacaoFinanceiraDeposito(
        @Body() request: EfeturarDepositoDto,
    ): Promise<MovimentacaoFinanceiraDto> {
        try {
            const response = await this.efetuarDepositoUseCase.execute(request)

            return response
        } catch (e) {
            throw e
        }
    }

    // @Post('saque')
    // async efetuarMovimentacaoFinanceiraSaque(@Body() request: any): Promise<MovimentacaoFinanceiraDto> {
    //     try {
    //         const response = await this.efetuarSaqueUseCase.execute(request)

    //         return response
    //     } catch (e) {
    //         throw e
    //     }
    // }

    // @Post('transferencia')
    // async efetuarMovimentacaoFinanceiraTransferencia(@Body() request: any): Promise<MovimentacaoFinanceiraDto> {
    //     try {
    //         const response = await this.efetuarTransferenciaUseCase.execute(request)

    //         return response
    //     } catch (e) {
    //         throw e
    //     }
    // }
}
