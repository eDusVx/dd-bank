import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsEnum,
    IsNumber,
    Min,
    IsArray,
    ArrayNotEmpty,
    Validate,
} from 'class-validator'
import { STATUS_CONTA } from '../Conta'
import { MovimentacaoFinanceira } from '../MovimentacaoFinanceira'
import { MovimentacaoFinanceiraDto } from './MovimentacaoFinanceira.dto'

export class CriarContaDto {
    @IsOptional()
    @IsNotEmpty({ message: 'O clienteId não pode ser vazio' })
    @IsNumber({}, { message: 'O número da conta deve ser um número' })
    @Min(1, { message: 'O número da conta deve ser maior que 0' })
    numeroConta: number

    @IsString({ message: 'O clienteId deve ser uma string' })
    @IsNotEmpty({ message: 'O clienteId não pode ser vazio' })
    clienteId: string
}

export class CarregarContaDto {
    @IsNotEmpty({ message: 'O clienteId não pode ser vazio' })
    @IsNumber({}, { message: 'O saldo deve ser um número' })
    @Min(0, { message: 'O saldo não pode ser negativo' })
    saldo: number

    @IsNotEmpty({ message: 'O clienteId não pode ser vazio' })
    @IsEnum(STATUS_CONTA, { message: 'O status da conta deve ser um valor válido' })
    @IsNotEmpty({ message: 'O clienteId não pode ser vazio' })
    status: STATUS_CONTA

    @IsString({ message: 'O clienteId deve ser uma string' })
    @IsNotEmpty({ message: 'O clienteId não pode ser vazio' })
    clienteId: string

    @IsNotEmpty({ message: 'O clienteId não pode ser vazio' })
    @IsArray({ message: 'Movimentações financeiras devem ser um array' })
    movimentacaoFinanceira: MovimentacaoFinanceira[]
}

export class ContaDto {
    @IsNumber({}, { message: 'O número da conta deve ser um número' })
    @Min(1, { message: 'O número da conta deve ser maior que 0' })
    numeroConta: number

    @IsNumber({}, { message: 'O saldo deve ser um número' })
    @Min(0, { message: 'O saldo não pode ser negativo' })
    saldo: number

    @IsEnum(STATUS_CONTA, { message: 'O status da conta deve ser um valor válido' })
    status: STATUS_CONTA

    @IsString({ message: 'O clienteId deve ser uma string' })
    @IsNotEmpty({ message: 'O clienteId não pode ser vazio' })
    clienteId: string

    @IsArray({ message: 'Movimentações financeiras devem ser um array' })
    @ArrayNotEmpty({ message: 'O array de movimentações financeiras não pode ser vazio' })
    @Validate(MovimentacaoFinanceiraDto, { each: true, message: 'Cada movimentação financeira deve ser válida' })
    movimentacaoFinanceira: MovimentacaoFinanceiraDto[]
}

export class AtualizarStatusContaDto {
    @IsEnum(STATUS_CONTA, { message: 'O status da conta deve ser um valor válido' })
    status: STATUS_CONTA
}
