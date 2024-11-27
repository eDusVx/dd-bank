import { HttpException, HttpStatus } from '@nestjs/common'

export class ClienteException extends HttpException {
    constructor(message: string) {
        super(
            { message: message, error: ClienteException.name, statusCode: HttpStatus.BAD_REQUEST },
            HttpStatus.BAD_REQUEST,
        )
    }
}
