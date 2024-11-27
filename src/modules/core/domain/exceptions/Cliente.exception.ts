import { HttpException, HttpStatus } from '@nestjs/common'

export class ClienteException extends HttpException {
    constructor(message: string) {
        super(
            { message: message, error: ClienteException.name, statusCode: HttpStatus.UNPROCESSABLE_ENTITY },
            HttpStatus.UNPROCESSABLE_ENTITY,
        )
    }
}
