import { HttpException, HttpStatus } from '@nestjs/common'

export class SenhaInvalidaException extends HttpException {
    constructor(message: string) {
        super(
            { message: message, error: SenhaInvalidaException.name, statusCode: HttpStatus.UNPROCESSABLE_ENTITY },
            HttpStatus.UNPROCESSABLE_ENTITY,
        )
    }
}
