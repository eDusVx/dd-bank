
export interface AuthService {
    generateJwt(cpf: string): Promise<string>
    verifyJwt(token: string): Promise<void>
}