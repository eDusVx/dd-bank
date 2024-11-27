import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { AtualizarStatusContaDto, CriarContaRequestDto } from './application/dto/Conta.dto'
import { CriarContaUseCase } from './application/usecases/CriarConta.usecase'
import { AtualizarStatusContaUseCase } from './application/usecases/AualizarStatusConta.usecase'
import { BuscarContasQuery } from './application/queries/BuscarContas.query'
import { ContaDto } from './domain/Conta'

@Controller('contas')
export class ContasController {
    constructor(
        private readonly criarContaUseCase: CriarContaUseCase,
        private readonly atualizarStatusContaUseCase: AtualizarStatusContaUseCase,
        private readonly buscarContasQuery: BuscarContasQuery,
    ) {}

    @Post('')
    async criarConta(@Body() request: CriarContaRequestDto): Promise<ContaDto> {
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
