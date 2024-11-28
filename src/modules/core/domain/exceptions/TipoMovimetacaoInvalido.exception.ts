import { HttpException, HttpStatus } from '@nestjs/common'

export class TipoMovimetacaoInvalidoException extends HttpException {
    constructor(message: string) {
        super(
            { message: message, error: TipoMovimetacaoInvalidoException.name, statusCode: HttpStatus.UNPROCESSABLE_ENTITY },
            HttpStatus.UNPROCESSABLE_ENTITY,
        )
    }
}
