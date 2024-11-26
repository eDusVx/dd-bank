import { Cliente } from '../Cliente'

export interface ClienteRepository {
    salvarCliente(cliente: Cliente): Promise<void>
    buscarPorId(id: string): Promise<Cliente>
    buscarTodos(): Promise<Cliente[]>
}
