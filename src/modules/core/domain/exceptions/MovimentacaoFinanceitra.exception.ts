import { HttpException, HttpStatus } from '@nestjs/common'

export class MovimentacaoFinanceiraException extends HttpException {
    constructor(message: string) {
        super(
            { message: message, error: MovimentacaoFinanceiraException.name, statusCode: HttpStatus.BAD_REQUEST },
            HttpStatus.BAD_REQUEST,
        )
    }
}
