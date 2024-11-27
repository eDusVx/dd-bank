import { IsNumber, Min, IsPositive, IsNotEmpty } from 'class-validator'

export class EfeturarDepositoRequestDto {
    @IsNumber({}, { message: 'O valor deve ser um número' })
    @IsNotEmpty({ message: 'O status da conta não pode ser vazio.' })
    @IsPositive({ message: 'O valor deve ser positivo' })
    valor: number

    @IsNumber({}, { message: 'O número da conta de destino deve ser um número' })
    @IsNotEmpty({ message: 'O status da conta não pode ser vazio.' })
    @Min(1, { message: 'O número da conta de destino deve ser maior que 0' })
    numeroContaDestino: number
}

export class EfeturarSaqueRequestDto {
    @IsNumber({}, { message: 'O valor deve ser um número' })
    @IsNotEmpty({ message: 'O status da conta não pode ser vazio.' })
    @IsPositive({ message: 'O valor deve ser positivo' })
    valor: number

    @IsNumber({}, { message: 'O número da conta de destino deve ser um número' })
    @IsNotEmpty({ message: 'O status da conta não pode ser vazio.' })
    @Min(1, { message: 'O número da conta de destino deve ser maior que 0' })
    numeroContaOrigem: number
}

export class EfeturarTransferenciaRequestDto {
    @IsNumber({}, { message: 'O valor deve ser um número' })
    @IsNotEmpty({ message: 'O status da conta não pode ser vazio.' })
    @IsPositive({ message: 'O valor deve ser positivo' })
    valor: number

    @IsNumber({}, { message: 'O número da conta de destino deve ser um número' })
    @IsNotEmpty({ message: 'O status da conta não pode ser vazio.' })
    @Min(1, { message: 'O número da conta de destino deve ser maior que 0' })
    numeroContaOrigem: number

    @IsNumber({}, { message: 'O número da conta de destino deve ser um número' })
    @IsNotEmpty({ message: 'O status da conta não pode ser vazio.' })
    @Min(1, { message: 'O número da conta de destino deve ser maior que 0' })
    numeroContaDestino: number
}
