import { STATUS_CONTA } from '../../domain/Conta'

export interface CriarContaRequest {
    clienteId: string
}

export interface AtualizarStatusContaRequest {
    status: STATUS_CONTA
}
