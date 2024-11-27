import { Injectable } from '@nestjs/common'
import { ContaBancariaModel } from '../models/Conta.model'
import { Conta } from '../../domain/Conta'
import { MovimentacaoFinanceiraModel } from '../models/MovimentacaoFinanceira.model'
import { MovimentacaoFinanceiraMapper } from './MovimentacaoFinaneira.mapper'
import { MovimentacaoFinanceira } from '../../domain/MovimentacaoFinanceira'

@Injectable()
export class ContaMapper {
    constructor(private readonly movimentacaoFinanceiraMapper: MovimentacaoFinanceiraMapper) {}
    public modelToDomain(model: ContaBancariaModel): Conta {
        try {
            let movimentacoesFinanceiras: MovimentacaoFinanceira[] = []
            if (model.movimentacoes) {
                movimentacoesFinanceiras = this.movimentacaoFinanceiraMapper.modelListToDomain(model.movimentacoes)
            }
            const contaDomain = Conta.carregar(
                {
                    saldo: model.saldo,
                    status: model.status,
                    clienteId: model.clienteId,
                    movimentacaoFinanceira: movimentacoesFinanceiras,
                },
                model.numeroConta,
            )

            return contaDomain
        } catch (e) {
            throw e
        }
    }

    public modelListToDomain(model: ContaBancariaModel[]): Conta[] {
        try {
            let contasDomain: Conta[] = []

            for (const conta of model) {
                let movimentacoesFinanceiras: MovimentacaoFinanceira[] = []
                if (conta.movimentacoes) {
                    movimentacoesFinanceiras = this.movimentacaoFinanceiraMapper.modelListToDomain(conta.movimentacoes)
                }
                const domain = Conta.carregar(
                    {
                        saldo: conta.saldo,
                        status: conta.status,
                        clienteId: conta.clienteId,
                        movimentacaoFinanceira: movimentacoesFinanceiras,
                    },
                    conta.numeroConta,
                )
                contasDomain.push(domain)
            }
            return contasDomain
        } catch (e) {
            throw e
        }
    }

    public domainToModel(domain: Conta): ContaBancariaModel {
        let movimentacoesFinanceirasModel: MovimentacaoFinanceiraModel[] = []
        if (domain.getMovimentacaoFinanceira()) {
            movimentacoesFinanceirasModel = this.movimentacaoFinanceiraMapper.domainToModelList(
                domain.getMovimentacaoFinanceira(),
            )
        }

        const model = ContaBancariaModel.build(
            {
                numeroConta: domain.getNumeroConta(),
                saldo: domain.getSaldo(),
                status: domain.getStatus(),
                clienteId: domain.getClienteId(),
                movimentacoes: movimentacoesFinanceirasModel,
            },
            {
                include: [MovimentacaoFinanceiraModel],
            },
        )

        return model
    }

    public domainToModelList(domain: Conta[]): ContaBancariaModel[] {
        const models: ContaBancariaModel[] = []
        for (const conta of domain) {
            let movimentacoesFinanceirasModel: MovimentacaoFinanceiraModel[] = []
            if (conta.getMovimentacaoFinanceira()) {
                movimentacoesFinanceirasModel = this.movimentacaoFinanceiraMapper.domainToModelList(
                    conta.getMovimentacaoFinanceira(),
                )
            }
            const contaModel = new ContaBancariaModel(
                {
                    numeroConta: conta.getNumeroConta(),
                    saldo: conta.getSaldo(),
                    status: conta.getStatus(),
                    clienteId: conta.getClienteId(),
                    movimentacoes: movimentacoesFinanceirasModel,
                },
                {
                    include: [MovimentacaoFinanceiraModel],
                },
            )
            models.push(contaModel)
        }

        return models
    }
}
