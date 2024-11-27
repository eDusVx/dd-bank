import { HttpException, HttpStatus } from '@nestjs/common'

export class SaldoInsuficienteException extends HttpException {
    constructor(message: string) {
        super(
            { message: message, error: SaldoInsuficienteException.name, statusCode: HttpStatus.BAD_REQUEST },
            HttpStatus.BAD_REQUEST,
        )
    }
}
