import { HttpException, HttpStatus } from '@nestjs/common'

export class ParametrosInvalidosException extends HttpException {
    constructor(message: string) {
        super(
            { message: message, error: ParametrosInvalidosException.name, statusCode: HttpStatus.BAD_REQUEST },
            HttpStatus.BAD_REQUEST,
        )
    }
}
