import { Body, Controller, Get, HttpException, Inject, Logger, Param, Post } from '@nestjs/common'
import { ClienteDto, CriarClienteDto } from './domain/dto/Cliente/Cliente.dto'
import { CriarClienteUseCase } from './application/usecases/CriarCliente.usecase'
import { BuscarClientesQuery } from './application/queries/BuscarClientes.query'

@Controller('clientes')
export class ClientesController {
    private logger = new Logger('ClientesController')
    constructor(
        private readonly cadastrarClienteUseCase: CriarClienteUseCase,
        private readonly buscarClientesQuery: BuscarClientesQuery,
    ) {}

    @Post('')
    async cadastrarCliente(@Body() request: CriarClienteDto): Promise<ClienteDto> {
        try {
            const response = await this.cadastrarClienteUseCase.execute(request)

            return response
        } catch (e) {
            throw e
        }
    }

    @Get(':id?')
    async obterCliente(@Param('id') id: string): Promise<ClienteDto | ClienteDto[]> {
        try {
            const response = await this.buscarClientesQuery.execute(id)

            return response
        } catch (e) {
            throw e
        }
    }
}
