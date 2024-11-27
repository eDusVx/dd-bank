export interface ClienteDto {
    cpf: string
    nome: string
    dataNascimento: Date
    contas: number[]
}

export interface CriarClienteProps {
    cpf: string
    nome: string
    dataNascimento: Date
}

export interface CarregarClienteProps {
    cpf: string
    nome: string
    dataNascimento: Date
    contas: number[]
}

export class Cliente {
    private cpf: string
    private nome: string
    private dataNascimento: Date
    private contas: number[]

    private constructor(cpf: string) {
        this.cpf = cpf
    }

    public static criar(props: CriarClienteProps): Cliente {
        const instance = new Cliente(props.cpf)
        try {
            instance.setNome(props.nome)
            instance.setCpf(props.cpf)
            instance.setDataNascimento(props.dataNascimento)
            instance.setContas([])
        } catch (e) {
            throw e
        }

        return instance
    }

    public static carregar(props: CarregarClienteProps): Cliente {
        const instance = new Cliente(props.cpf)
        try {
            instance.setNome(props.nome)
            instance.setCpf(props.cpf)
            instance.setDataNascimento(props.dataNascimento)
            instance.setContas(props.contas)
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

    private setContas(contas: number[]) {
        try {
            this.contas = contas
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

    public getContas(): number[] {
        return this.contas
    }

    public toDTO(): ClienteDto {
        return {
            cpf: this.getCpf(),
            nome: this.getNome(),
            dataNascimento: this.getDataNascimento(),
            contas: this.getContas(),
        }
    }
}
