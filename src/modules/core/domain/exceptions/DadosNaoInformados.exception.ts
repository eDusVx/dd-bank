import { HttpException, HttpStatus } from '@nestjs/common'

export class DadosNaoInformadosException extends HttpException {
    constructor(message: string) {
        super(
            { message: message, error: DadosNaoInformadosException.name, statusCode: HttpStatus.BAD_REQUEST },
            HttpStatus.BAD_REQUEST,
        )
    }
}
