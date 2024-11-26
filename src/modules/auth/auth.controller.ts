import { Controller, Get } from '@nestjs/common'

@Controller('auth')
export class AuthController {
    @Get()
    getHello(): string {
        return 'Hello World!'
    }
}
