import { HttpException, HttpStatus } from '@nestjs/common'

export class ClienteNaoEcontradoException extends HttpException {
    constructor(message: string) {
        super(
            { message: message, error: ClienteNaoEcontradoException.name, statusCode: HttpStatus.NOT_FOUND },
            HttpStatus.NOT_FOUND,
        )
    }
}
