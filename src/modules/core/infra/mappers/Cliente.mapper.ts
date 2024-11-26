import { Injectable } from '@nestjs/common'
import { ClienteModel } from '../models/Cliente.model'
import { Cliente } from '../../domain/Cliente'
import { ContaMapper } from './Conta.mapper'

@Injectable()
export class ClienteMapper {
    constructor(private readonly contaMapper: ContaMapper) {}
    public modelToDomain(model: ClienteModel): Cliente {
        try {
            const clienteDomain = Cliente.carregar({
                nome: model.nome,
                cpf: model.cpf,
                dataNascimento: model.dataNascimento,
                contas: model.contas.map((conta) => conta.numeroConta),
            })
            return clienteDomain
        } catch (e) {
            throw e
        }
    }

    public modelListToDomain(model: ClienteModel[]): Cliente[] {
        try {
            let clientesDomain: Cliente[] = []

            for (const cliente of model) {
                const domain = Cliente.carregar({
                    nome: cliente.nome,
                    cpf: cliente.cpf,
                    dataNascimento: cliente.dataNascimento,
                    contas: cliente.contas.map((conta) => conta.numeroConta),
                })
                clientesDomain.push(domain)
            }
            return clientesDomain
        } catch (e) {
            throw e
        }
    }

    public domainToModel(domain: Cliente): ClienteModel {
        const model = new ClienteModel({
            cpf: domain.getCpf(),
            nome: domain.getNome(),
            dataNascimento: domain.getDataNascimento(),
        })

        return model
    }
}
