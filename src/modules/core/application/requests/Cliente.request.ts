import { ApiProperty } from '@nestjs/swagger'

export class CadastrarClienteRequest {
    @ApiProperty({
        description: 'Nome do cliente a ser cadastrado no sistema',
        example: 'Eduardo Xavier',
    })
    nome: string

    @ApiProperty({
        description: 'Cpf do cliente a ser cadastrado no sistema',
        example: '00000000000',
    })
    cpf: string

    @ApiProperty({
        description: 'Data de nascimento do cliente a ser cadastrado no sistema',
        example: '2000-05-12',
    })
    dataNascimento: Date


    @ApiProperty({
        description: 'Senha do cliente para cadastro no sistema',
        example: '1234567',
    })
    senha: string
}

export class LogarClienteRequest {
    @ApiProperty({ description: 'E-mail do usuário' })
    cpf: string

    @ApiProperty({ description: 'Senha do usuário' })
    senha: string
}
