import { Inject, Injectable } from '@nestjs/common'
import { ContaBancariaModel } from '../models/Conta.model'
import { BuscarProximIdQueryResponse, ContaRepository } from '../../domain/repositories/Conta.repository'
import { Conta } from '../../domain/Conta'
import { ContaMapper } from '../mappers/Conta.mapper'
import { ContaNaoEcontradaException } from '../../domain/exceptions/ContaNaoEcontrada.exception'
import { MovimentacaoFinanceiraModel } from '../models/MovimentacaoFinanceira.model'

@Injectable()
export class ContaRepositoryImpl implements ContaRepository {
    constructor(
        @Inject('ContaModel')
        private readonly contaModel: typeof ContaBancariaModel,
        @Inject('MovimentacoesModel')
        private readonly movimentacoesModel: typeof MovimentacaoFinanceiraModel,
        private readonly contaMapper: ContaMapper,
    ) {}
    async buscarTodos(): Promise<Conta[]> {
        try {
            const buscarConta = await this.contaModel.findAll<ContaBancariaModel>({
                include: [
                    {
                        model: MovimentacaoFinanceiraModel,
                    },
                ],
            })

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
                include: [
                    {
                        model: MovimentacaoFinanceiraModel,
                    },
                ],
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
            const contaModelResult = this.contaMapper.domainToModel(conta)

            for (const movimentacoes of contaModelResult.movimentacoes) {
                await this.movimentacoesModel.upsert(movimentacoes.toJSON())
            }

            await this.contaModel.upsert(contaModelResult.toJSON())
        } catch (e) {
            throw e
        }
    }

    async salvarContas(contas: Conta[]): Promise<void> {
        try {
            const contasModel = this.contaMapper.domainToModelList(contas)
            for (const conta of contasModel) {
                for (const movimentacoes of conta.movimentacoes) {
                    await this.movimentacoesModel.upsert(movimentacoes.toJSON())
                }
                await this.contaModel.upsert(conta.toJSON())
            }
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
