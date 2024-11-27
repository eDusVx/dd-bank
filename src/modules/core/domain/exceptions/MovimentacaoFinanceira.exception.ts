import { HttpException, HttpStatus } from '@nestjs/common'

export class MovimentacaoFinanceiraException extends HttpException {
    constructor(message: string) {
        super(
            {
                message: message,
                error: MovimentacaoFinanceiraException.name,
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
        )
    }
}
