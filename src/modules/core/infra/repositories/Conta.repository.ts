import { Inject, Injectable } from '@nestjs/common'
import { ContaBancariaModel } from '../models/Conta.model'
import { BuscarProximIdQueryResponse, ContaRepository } from '../../domain/repositories/Conta.repository'
import { Conta } from '../../domain/Conta'
import { ContaMapper } from '../mappers/Conta.mapper'
import { ContaNaoEcontradaException } from '../../domain/exceptions/ContaNaoEcontrada.exception'

@Injectable()
export class ContaRepositoryImpl implements ContaRepository {
    constructor(
        @Inject('ContaModel')
        private readonly contaModel: typeof ContaBancariaModel,
        private readonly contaMapper: ContaMapper,
    ) {}
    async buscarTodos(): Promise<Conta[]> {
        try {
            const buscarConta = await this.contaModel.findAll<ContaBancariaModel>()

            if (!buscarConta) throw new ContaNaoEcontradaException(`Nenhuma conta foi encontrada`)

            const contas = this.contaMapper.modelListToDomain(buscarConta)
            return contas
        } catch (e) {
            throw e
        }
    }
    async buscarContaPorNumero(numeroConta: number): Promise<Conta> {
        try {
            const buscarConta = await this.contaModel.findOne({
                where: {
                    numeroConta: numeroConta,
                },
            })

            if (!buscarConta) throw new ContaNaoEcontradaException(`Nenhuma conta foi encontrada`)

            const conta = this.contaMapper.modelToDomain(buscarConta)

            return conta
        } catch (e) {
            throw e
        }
    }

    async salvarConta(conta: Conta): Promise<void> {
        try {
            const clienteModelResult = this.contaMapper.domainToModel(conta)

            await this.contaModel.upsert(clienteModelResult.toJSON())
        } catch (e) {
            throw e
        }
    }

    async buscarProximoId(): Promise<number> {
        try {
            const [result]: [BuscarProximIdQueryResponse[]] = await this.contaModel.sequelize.query<
                [BuscarProximIdQueryResponse[]]
            >(`SELECT nextval('conta_bancaria_numero_conta_seq') as nextid`, null)

            return result[0].nextid
        } catch (e) {
            throw e
        }
    }
}
