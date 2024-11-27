import { Inject, Injectable } from '@nestjs/common'
import { ContaBancariaModel } from '../models/Conta.model'
import { BuscarProximoIdQueryResponse, ContaRepository } from '../../domain/repositories/Conta.repository'
import { Conta } from '../../domain/Conta'
import { ContaMapper } from '../mappers/Conta.mapper'
import { ContaNaoEncontradaException } from '../../domain/exceptions/ContaNaoEncontrada.exception'

@Injectable()
export class ContaRepositoryImpl implements ContaRepository {
    constructor(
        @Inject('ContaModel')
        private readonly contaModel: typeof ContaBancariaModel,
        private readonly contaMapper: ContaMapper,
    ) {}
    async buscarTodos(): Promise<Conta[]> {
        try {
            const buscarConta = await this.contaModel.findAll()

            if (!buscarConta) throw new ContaNaoEncontradaException(`Nenhuma conta foi encontrada`)

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

            if (!buscarConta) throw new ContaNaoEncontradaException(`Nenhuma conta foi encontrada`)

            const conta = this.contaMapper.modelToDomain(buscarConta)

            return conta
        } catch (e) {
            throw e
        }
    }

    async salvarConta(conta: Conta): Promise<void> {
        try {
            const contaModelResult = this.contaMapper.domainToModel(conta)

            await this.contaModel.upsert(contaModelResult.toJSON())
        } catch (e) {
            throw e
        }
    }

    async salvarContas(contas: Conta[]): Promise<void> {
        try {
            const contasModel = this.contaMapper.domainToModelList(contas)
            for (const conta of contasModel) {
                await this.contaModel.upsert(conta.toJSON())
            }
        } catch (e) {
            throw e
        }
    }

    async buscarProximoId(): Promise<number> {
        try {
            const [result]: [BuscarProximoIdQueryResponse[]] = await this.contaModel.sequelize.query<
                [BuscarProximoIdQueryResponse[]]
            >(`SELECT CAST(nextval('conta_bancaria_numero_conta_seq') AS INTEGER) as nextid`, null)

            return result[0].nextid
        } catch (e) {
            throw e
        }
    }
}
