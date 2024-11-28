import { HttpException, HttpStatus } from '@nestjs/common'

export class MesmaContaTransferenciaException extends HttpException {
    constructor(message: string) {
        super(
            { message: message, error: MesmaContaTransferenciaException.name, statusCode: HttpStatus.UNPROCESSABLE_ENTITY },
            HttpStatus.UNPROCESSABLE_ENTITY,
        )
    }
}
