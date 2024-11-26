import { v4 as uuidv4 } from 'uuid'
import { ClienteDto, CriarClienteDto } from './dto/Cliente/Cliente.dto'

export class Cliente {
    private id: string
    private nome: string
    private cpf: string
    private dataNascimento: Date

    private constructor(id: string) {
        this.id = id
    }

    public static async criar(props: CriarClienteDto): Promise<Cliente> {
        const id = uuidv4()

        const instance = new Cliente(id)
        try {
            instance.setNome(props.nome)
            instance.setCpf(props.cpf)
            instance.setDataNascimento(props.dataNascimento)
        } catch (e) {
            throw e
        }

        return instance
    }

    public static carregar(props: CriarClienteDto, id: string): Cliente {
        const instance = new Cliente(id)
        try {
            instance.setNome(props.nome)
            instance.setCpf(props.cpf)
            instance.setDataNascimento(props.dataNascimento)
        } catch (e) {
            throw e
        }

        return instance
    }

    private setNome(nome: string) {
        try {
            this.nome = nome
        } catch (e) {
            throw e
        }
    }

    private setCpf(cpf: string) {
        try {
            this.cpf = cpf
        } catch (e) {
            throw e
        }
    }

    private setDataNascimento(dataNascimento: Date) {
        try {
            this.dataNascimento = dataNascimento
        } catch (e) {
            throw e
        }
    }

    public getNome(): string {
        return this.nome
    }

    public getCpf(): string {
        return this.cpf
    }

    public getDataNascimento(): Date {
        return this.dataNascimento
    }

    public getId(): string {
        return this.id
    }

    public toDTO(): ClienteDto {
        return {
            id: this.getId(),
            nome: this.getNome(),
            cpf: this.getCpf(),
            dataNascimento: this.getDataNascimento(),
        }
    }
}
