import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { CadastrarClienteUseCase } from './application/usecases/CadastrarCliente.usecase'
import { BuscarClientesQuery } from './application/queries/BuscarClientes.query'
import { CadastrarClienteRequest } from './application/requests/Cliente.request'
import { ClienteDto } from './domain/Cliente'

@Controller('clientes')
export class ClientesController {
    constructor(
        private readonly cadastrarClienteUseCase: CadastrarClienteUseCase,
        private readonly buscarClientesQuery: BuscarClientesQuery,
    ) {}

    @Post('')
    async cadastrarCliente(@Body() request: CadastrarClienteRequest): Promise<ClienteDto> {
        try {
            const response = await this.cadastrarClienteUseCase.execute(request)

            return response
        } catch (e) {
            throw e
        }
    }

    @Get(':id?')
    async buscarClientes(@Param('id') id: string): Promise<ClienteDto | ClienteDto[]> {
        try {
            const response = await this.buscarClientesQuery.execute(id)

            return response
        } catch (e) {
            throw e
        }
    }
}
