export class EfeturarDepositoRequest {
    valor: number
    numeroContaDestino: number
}

export class EfeturarSaqueRequest {
    valor: number
    numeroContaOrigem: number
}

export class EfeturarTransferenciaRequest {
    valor: number
    numeroContaOrigem: number
    numeroContaDestino: number
}
