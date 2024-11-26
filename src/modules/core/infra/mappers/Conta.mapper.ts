import { Injectable } from '@nestjs/common'
import { ContaBancariaModel } from '../models/Conta.model'
import { Conta } from '../../domain/Conta'

@Injectable()
export class ContaMapper {
    public modelToDomain(model: ContaBancariaModel): Conta {
        try {
            const contaDomain = Conta.carregar(
                {
                    saldo: model.saldo,
                    status: model.status,
                    clienteId: model.clienteId,
                    movimentacaoFinanceira: [],
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
                const domain = Conta.carregar(
                    {
                        saldo: conta.saldo,
                        status: conta.status,
                        clienteId: conta.clienteId,
                        movimentacaoFinanceira: [],
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
        const model = new ContaBancariaModel({
            numeroConta: domain.getNumeroConta(),
            saldo: domain.getSaldo(),
            status: domain.getStatus(),
            clienteId: domain.getClienteId(),
        })

        return model
    }
}
