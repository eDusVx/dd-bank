import { HttpException, HttpStatus } from '@nestjs/common'

export class ContaNaoEncontradaException extends HttpException {
    constructor(message: string) {
        super(
            { message: message, error: ContaNaoEncontradaException.name, statusCode: HttpStatus.NOT_FOUND },
            HttpStatus.NOT_FOUND,
        )
    }
}
