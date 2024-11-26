import { HttpException, HttpStatus } from '@nestjs/common'

export class StatusContaInvalidoEception extends HttpException {
    constructor(message: string) {
        super(
            { message: message, error: StatusContaInvalidoEception.name, statusCode: HttpStatus.BAD_REQUEST },
            HttpStatus.BAD_REQUEST,
        )
    }
}
