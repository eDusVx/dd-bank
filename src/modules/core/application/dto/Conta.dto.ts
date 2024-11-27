import { IsString, IsNotEmpty, Length, Matches } from 'class-validator'
import { STATUS_CONTA } from '../../domain/Conta'

export class CriarContaRequestDto {
    @IsString({ message: 'O cpf deve ser uma string' })
    @Length(11, 11, { message: 'O cpf deve ter 11 dígitos.' })
    @Matches(/^\d{11}$/, { message: 'O CPF deve conter apenas números.' })
    @IsNotEmpty({ message: 'O cpf não pode ser vazio.' })
    clienteId: string
}

export class AtualizarStatusContaDto {
    @IsString({ message: 'O novo status da conta deve ser uma string' })
    @IsNotEmpty({ message: 'O status da conta não pode ser vazio.' })
    status: STATUS_CONTA
}
