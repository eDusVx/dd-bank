import { Injectable } from '@nestjs/common'
import { ClienteModel } from '../models/Cliente.model'
import { Cliente } from '../../domain/Cliente'

@Injectable()
export class ClienteMapper {
    public async modelToDomain(model: ClienteModel): Promise<Cliente> {
        try {
            const domain = Cliente.carregar(
                {
                    nome: model.nome,
                    cpf: model.cpf,
                    dataNascimento: model.dataNascimento,
                },
                model.id,
            )
            return domain
        } catch (e) {
            throw e
        }
    }

    public async modelListToDomain(model: ClienteModel[]): Promise<Cliente[]> {
        try {
            let clientesDomain: Cliente[] = []

            for (const cliente of model) {
                const domain = Cliente.carregar(
                    {
                        nome: cliente.nome,
                        cpf: cliente.cpf,
                        dataNascimento: cliente.dataNascimento,
                    },
                    cliente.id,
                )
                clientesDomain.push(domain)
            }
            return clientesDomain
        } catch (e) {
            throw e
        }
    }

    public domainToModel(domain: Cliente): ClienteModel {
        console.log('ID', domain.getId())
        const model = new ClienteModel({
            id: domain.getId(),
            nome: domain.getNome(),
            cpf: domain.getCpf(),
            dataNascimento: domain.getDataNascimento(),
        })

        return model
    }
}
