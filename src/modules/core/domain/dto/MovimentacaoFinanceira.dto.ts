import { IsString, IsNumber, Min, IsEnum, IsDate, IsPositive } from 'class-validator'
import { TIPO_MOVIMENTACAO } from '../MovimentacaoFinanceira'

export class CriarMovimentacaoFinanceiraDto {
    @IsString({ message: 'O id deve ser uma string' })
    id: string

    @IsNumber({}, { message: 'O valor deve ser um número' })
    @IsPositive({ message: 'O valor deve ser positivo' })
    valor: number

    @IsDate({ message: 'A data deve ser uma data válida' })
    data: Date

    @IsEnum(TIPO_MOVIMENTACAO, { message: 'O tipo de movimentação deve ser um valor válido de TIPO_MOVIMENTACAO' })
    tipoMovimentacao: TIPO_MOVIMENTACAO

    @IsNumber({}, { message: 'O número da conta de origem deve ser um número' })
    @Min(1, { message: 'O número da conta de origem deve ser maior que 0' })
    numeroContaOrigem: number

    @IsNumber({}, { message: 'O número da conta de destino deve ser um número' })
    @Min(1, { message: 'O número da conta de destino deve ser maior que 0' })
    numeroContaDestino: number
}

export class MovimentacaoFinanceiraDto {
    @IsString({ message: 'O id deve ser uma string' })
    id: string

    @IsNumber({}, { message: 'O valor deve ser um número' })
    @IsPositive({ message: 'O valor deve ser positivo' })
    valor: number

    @IsDate({ message: 'A data deve ser uma data válida' })
    data: Date

    @IsEnum(TIPO_MOVIMENTACAO, { message: 'O tipo de movimentação deve ser um valor válido de TIPO_MOVIMENTACAO' })
    tipoMovimentacao: TIPO_MOVIMENTACAO

    @IsNumber({}, { message: 'O número da conta de origem deve ser um número' })
    @Min(1, { message: 'O número da conta de origem deve ser maior que 0' })
    numeroContaOrigem: number

    @IsNumber({}, { message: 'O número da conta de destino deve ser um número' })
    @Min(1, { message: 'O número da conta de destino deve ser maior que 0' })
    numeroContaDestino: number
}
