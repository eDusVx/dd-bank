import { ApiProperty } from '@nestjs/swagger'
import { STATUS_CONTA } from '../../domain/Conta'

export class CriarContaRequest {
    @ApiProperty({
        description: 'Cpf do cliente para criação da conta',
        example: '00000000000',
    })
    clienteId: string
}

export class AtualizarStatusContaRequest {
    @ApiProperty({
        description: 'Novo status para atrualização da conta',
        example: 'ATIVA',
    })
    status: STATUS_CONTA
}
