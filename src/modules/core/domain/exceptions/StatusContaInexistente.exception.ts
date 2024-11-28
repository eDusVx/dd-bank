import { HttpException, HttpStatus } from '@nestjs/common'

export class StatusContaInexistenteException extends HttpException {
    constructor(message: string) {
        super(
            {
                message: message,
                error: StatusContaInexistenteException.name,
                statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
        )
    }
}
