import { IsString, IsNotEmpty, Length, Matches, IsDate, MaxDate } from 'class-validator'
import { Transform } from 'class-transformer'

export class CadastrarClienteRequestDto {
    @IsString({ message: 'O nome deve ser uma string' })
    @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
    nome: string

    @IsString({ message: 'O cpf deve ser uma string' })
    @Length(11, 11, { message: 'O cpf deve ter 11 dígitos.' })
    @Matches(/^\d{11}$/, { message: 'O CPF deve conter apenas números.' })
    @IsNotEmpty({ message: 'O cpf não pode ser vazio.' })
    cpf: string

    @Transform(({ value }) => new Date(value), { toClassOnly: true })
    @IsDate({ message: 'A data de nascimento deve ser uma Data' })
    @IsNotEmpty({ message: 'A data de nascimento não pode ser vazio.' })
    @MaxDate(new Date(), { message: 'A data de nascimento deve ser anterior à data atual.' })
    dataNascimento: Date
}
