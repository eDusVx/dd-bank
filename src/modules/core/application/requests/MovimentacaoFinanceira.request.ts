import { ApiProperty } from "@nestjs/swagger"

export class EfeturarDepositoRequest {
    @ApiProperty({
        description: 'Valor a ser depositado',
        example: 100,
    })
    valor: number

    @ApiProperty({
        description: 'Numero da conta de destino do depósito',
        example: 1,
    })
    numeroContaDestino: number
}

export class EfeturarSaqueRequest {
    @ApiProperty({
        description: 'Valor a ser sacado',
        example: 100,
    })
    valor: number

    @ApiProperty({
        description: 'Numero da conta de origem do depósito',
        example: 1,
    })
    numeroContaOrigem: number
}

export class EfeturarTransferenciaRequest {
    @ApiProperty({
        description: 'Valor a ser transferido',
        example: 100,
    })
    valor: number

    @ApiProperty({
        description: 'Numero da conta de origem da transferência',
        example: 1,
    })
    numeroContaOrigem: number

    @ApiProperty({
        description: 'Numero da conta de destino da transferência',
        example: 2,
    })
    numeroContaDestino: number
}
