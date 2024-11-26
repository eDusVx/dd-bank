import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { AtualizarStatusContaDto, ContaDto, CriarContaDto } from './domain/dto/Conta.dto'
import { CriarContaUseCase } from './application/usecases/CriarConta.usecase'
import { AtualizarStatusContaUseCase } from './application/usecases/AualizarStatusConta.usecase'
import { BuscarContasQuery } from './application/queries/BuscarContas.query'

@Controller('contas')
export class ContasController {
    constructor(
        private readonly criarContaUseCase: CriarContaUseCase,
        private readonly atualizarStatusContaUseCase: AtualizarStatusContaUseCase,
        private readonly buscarContasQuery: BuscarContasQuery,
    ) {}

    @Post('')
    async criarConta(@Body() request: CriarContaDto): Promise<ContaDto> {
        try {
            const response = await this.criarContaUseCase.execute(request)

            return response
        } catch (e) {
            throw e
        }
    }

    @Get(':id?')
    async buscarContas(@Param('id') id: number): Promise<ContaDto | ContaDto[]> {
        try {
            const response = await this.buscarContasQuery.execute(id)

            return response
        } catch (e) {
            throw e
        }
    }

    @Patch(':id')
    async atualizarStatusConta(
        @Param('id') id: number,
        @Body() atualizarStatusContaDto: AtualizarStatusContaDto,
    ): Promise<ContaDto> {
        try {
            const response = await this.atualizarStatusContaUseCase.execute({
                numeroConta: id,
                ...atualizarStatusContaDto,
            })

            return response
        } catch (e) {
            throw e
        }
    }
}
