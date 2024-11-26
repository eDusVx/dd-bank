import { HttpException, HttpStatus } from '@nestjs/common'

export class DepositoMenorIgualZeroException extends HttpException {
    constructor(message: string) {
        super(
            { message: message, error: DepositoMenorIgualZeroException.name, statusCode: HttpStatus.BAD_REQUEST },
            HttpStatus.BAD_REQUEST,
        )
    }
}
