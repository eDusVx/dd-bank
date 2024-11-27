import { HttpException, HttpStatus } from '@nestjs/common'

export class ContaException extends HttpException {
    constructor(message: string) {
        super(
            { message: message, error: ContaException.name, statusCode: HttpStatus.BAD_REQUEST },
            HttpStatus.BAD_REQUEST,
        )
    }
}
