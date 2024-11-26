import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClienteModel } from '../models/Cliente.model'
import { ClienteRepository } from '../../domain/repositories/Cliente.repository'
import { Cliente } from '../../domain/Cliente'
import { ClienteMapper } from '../mappers/Cliente.mapper'
import { ClienteJaCadastradoException } from '../../domain/exceptions/ClienteJaCadastrado.exception'
import { ClienteNaoEcontradoException } from '../../domain/exceptions/ClienteNaoEcontrado.exception'

@Injectable()
export class ClienteRepositoryImpl implements ClienteRepository {
    private logger = new Logger('clienteRepository')
    constructor(
        @Inject('ClienteModel')
        private readonly clienteModel: typeof ClienteModel,
        private readonly clienteMapper: ClienteMapper,
    ) {}
    async buscarTodos(): Promise<Cliente[]> {
        try {
            const buscarCliente = await this.clienteModel.findAll<ClienteModel>()

            if (!buscarCliente) throw new ClienteNaoEcontradoException(`Nenhum cliente foi encontrado`)

            const cliente = this.clienteMapper.modelListToDomain(buscarCliente)
            return cliente
        } catch (e) {
            throw e
        }
    }
    async buscarPorId(id: string): Promise<Cliente> {
        try {
            const buscarCliente = await this.clienteModel.findOne<ClienteModel>({
                where: {
                    cpf: id,
                },
            })
            if (!buscarCliente) throw new ClienteNaoEcontradoException(`Nenhum cliente com cpf ${id} foi encontrado`)
            const cliente = this.clienteMapper.modelToDomain(buscarCliente)
            return cliente
        } catch (e) {
            throw e
        }
    }
    async salvarCliente(cliente: Cliente): Promise<void> {
        try {
            const clienteExiste = await this.clienteModel.findOne<ClienteModel>({
                where: {
                    cpf: cliente.getCpf(),
                },
            })
            if (clienteExiste)
                throw new ClienteJaCadastradoException(`Já existe um cliente com cpf ${cliente.getCpf()} cadastrado`)

            const clienteModelResult = this.clienteMapper.domainToModel(cliente)
            await clienteModelResult.save()
        } catch (e) {
            throw e
        }
    }
}