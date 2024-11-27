import { Injectable } from '@nestjs/common'
import { MovimentacaoFinanceiraModel } from '../models/MovimentacaoFinanceira.model'
import { MovimentacaoFinanceira } from '../../domain/MovimentacaoFinanceira'

@Injectable()
export class MovimentacaoFinanceiraMapper {
    constructor() {}
    public modelListToDomain(model: MovimentacaoFinanceiraModel[]): MovimentacaoFinanceira[] {
        try {
            const movimentacoesFinanceirasDomain: MovimentacaoFinanceira[] = []

            for (const movimentacaoFinanceira of model) {
                const domain = MovimentacaoFinanceira.carregar(
                    {
                        valor: movimentacaoFinanceira.valor,
                        data: new Date(movimentacaoFinanceira.dataHora),
                        tipoMovimentacao: movimentacaoFinanceira.tipo,
                        numeroContaDestino: movimentacaoFinanceira.contaDestinoId,
                        numeroContaOrigem: movimentacaoFinanceira.contaOrigemId,
                    },
                    movimentacaoFinanceira.id,
                )
                movimentacoesFinanceirasDomain.push(domain)
            }
            return movimentacoesFinanceirasDomain
        } catch (e) {
            throw e
        }
    }

    public domainToModelList(domain: MovimentacaoFinanceira[]): MovimentacaoFinanceiraModel[] {
        const models: MovimentacaoFinanceiraModel[] = []
        for (const movimentacaoFinanceira of domain) {
            const movimentacao = new MovimentacaoFinanceiraModel()
            movimentacao.setProps({
                id: movimentacaoFinanceira.getId(),
                contaOrigemId: movimentacaoFinanceira.getNumeroContaOrigem(),
                contaDestinoId: movimentacaoFinanceira.getNumeroContaDestino(),
                tipo: movimentacaoFinanceira.getTipoMovimentacao(),
                valor: movimentacaoFinanceira.getValor(),
                dataHora: movimentacaoFinanceira.getData(),
            })
            models.push(movimentacao)
        }

        return models
    }
}
