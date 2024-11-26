import { IsString, IsNotEmpty, Length, Matches, IsDate, MaxDate, IsArray, Validate, IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'

class IsGreaterThanZero {
    validate(value: number) {
        return value > 0
    }

    defaultMessage() {
        return 'O número deve ser maior que 0'
    }
}

export class CriarClienteDto {
    @IsString({ message: 'O nome deve ser uma string' })
    @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
    nome: string

    @IsString({ message: 'O cpf deve ser uma string' })
    @Length(11, 11, { message: 'O cpf deve ter 11 dígitos.' })
    @Matches(/^\d{11}$/, { message: 'O CPF deve conter apenas números.' })
    @IsNotEmpty({ message: 'O cpf não pode ser vazio.' })
    cpf: string

    @Transform(({ value }) => new Date(value), { toClassOnly: true })
    @IsDate({ message: 'A data de nascimento deve ser do tipo Data' })
    @IsNotEmpty({ message: 'A data de nascimento não pode ser vazio.' })
    @MaxDate(new Date(), { message: 'A data de nascimento deve ser anterior à data atual.' })
    dataNascimento: Date

    @IsOptional()
    @IsArray({ message: 'Contas deve ser um array' })
    @Validate(IsGreaterThanZero, { each: true, message: 'O numero da conta deve ser maior que 0' })
    contas?: number[]
}

export class ClienteDto {
    @IsString({ message: 'O nome deve ser uma string' })
    @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
    nome: string

    @IsString({ message: 'O cpf deve ser uma string' })
    @Length(11, 11, { message: 'O cpf deve ter 11 dígitos.' })
    @Matches(/^\d{11}$/, { message: 'O CPF deve conter apenas números.' })
    @IsNotEmpty({ message: 'O cpf não pode ser vazio.' })
    cpf: string

    @Transform(({ value }) => new Date(value), { toClassOnly: true })
    @IsDate({ message: 'A data de nascimento deve ser do tipo Data' })
    @IsNotEmpty({ message: 'A data de nascimento não pode ser vazio.' })
    @MaxDate(new Date(), { message: 'A data de nascimento deve ser anterior à data atual.' })
    dataNascimento: Date

    @IsArray({ message: 'Contas deve ser um array' })
    @Validate(IsGreaterThanZero, { each: true, message: 'O numero da conta deve ser maior que 0' })
    @IsNotEmpty({ message: 'A propriedade contas não pode ser nula.' })
    contas: number[]
}
