import { HttpException, HttpStatus } from '@nestjs/common'

export class ContaDestinoDiferenteException extends HttpException {
    constructor(message: string) {
        super(
            { message: message, error: ContaDestinoDiferenteException.name, statusCode: HttpStatus.BAD_REQUEST },
            HttpStatus.BAD_REQUEST,
        )
    }
}
