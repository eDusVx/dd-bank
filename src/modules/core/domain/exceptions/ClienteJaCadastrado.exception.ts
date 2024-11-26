import { HttpException, HttpStatus } from '@nestjs/common'

export class ClienteJaCadastradoException extends HttpException {
    constructor(message: string) {
        super(
            { message: message, error: ClienteJaCadastradoException.name, statusCode: HttpStatus.CONFLICT },
            HttpStatus.CONFLICT,
        )
    }
}
