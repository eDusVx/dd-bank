import { HttpException, HttpStatus } from '@nestjs/common'

export class ContaException extends HttpException {
    constructor(message: string) {
        super(
            { message: message, error: ContaException.name, statusCode: HttpStatus.UNPROCESSABLE_ENTITY },
            HttpStatus.UNPROCESSABLE_ENTITY,
        )
    }
}
