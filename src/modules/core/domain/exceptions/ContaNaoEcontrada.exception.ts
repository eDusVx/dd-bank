import { HttpException, HttpStatus } from '@nestjs/common'

export class ContaNaoEcontradaException extends HttpException {
    constructor(message: string) {
        super(
            { message: message, error: ContaNaoEcontradaException.name, statusCode: HttpStatus.NOT_FOUND },
            HttpStatus.NOT_FOUND,
        )
    }
}
