import { HttpException, HttpStatus } from '@nestjs/common'

export class SaldoInsuficienteException extends HttpException {
    constructor(message: string) {
        super(
            { message: message, error: SaldoInsuficienteException.name, statusCode: HttpStatus.UNPROCESSABLE_ENTITY },
            HttpStatus.UNPROCESSABLE_ENTITY,
        )
    }
}
