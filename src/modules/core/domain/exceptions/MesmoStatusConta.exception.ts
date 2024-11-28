import { HttpException, HttpStatus } from '@nestjs/common'

export class MesmoStatusContaException extends HttpException {
    constructor(message: string) {
        super(
            { message: message, error: MesmoStatusContaException.name, statusCode: HttpStatus.UNPROCESSABLE_ENTITY },
            HttpStatus.UNPROCESSABLE_ENTITY,
        )
    }
}
