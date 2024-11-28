import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthService } from '../../domain/services/Auth.service'

@Injectable()
export class AuthServiceImpl implements AuthService {
    constructor(private jwtService: JwtService) {}

    async generateJwt(userId: string): Promise<string> {
        const accessToken = this.jwtService.sign({ cpf: userId })
        return accessToken
    }

    async verifyJwt(token: string) {
        return this.jwtService.verifyAsync(token, {
            secret: process.env.JWT_TOKEN,
        })
    }
}
