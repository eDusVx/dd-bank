import { HttpException, HttpStatus } from '@nestjs/common'

export class StatusContaInvalidoEception extends HttpException {
    constructor(message: string) {
        super(
            { message: message, error: StatusContaInvalidoEception.name, statusCode: HttpStatus.UNPROCESSABLE_ENTITY },
            HttpStatus.UNPROCESSABLE_ENTITY,
        )
    }
}
