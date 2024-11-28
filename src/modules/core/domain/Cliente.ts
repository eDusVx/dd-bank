import { isArray, isDate, isEmpty, isNumber, isString, matches, maxDate } from 'class-validator'
import { isLength } from 'validator'
import { ClienteException } from './exceptions/Cliente.exception'
import * as bcrypt from 'bcrypt'
import { SenhaInvalidaException } from './exceptions/SenhaInvalida.excpetion'

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
    senha: string
}

export interface CarregarClienteProps {
    cpf: string
    nome: string
    dataNascimento: Date
    contas: number[]
    senha: string
}

export class Cliente {
    private cpf: string
    private nome: string
    private dataNascimento: Date
    private contas: number[]
    private senha: string

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
            instance.setSenha(props.senha)
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
            instance.setSenhaCarregada(props.senha)
        } catch (e) {
            throw e
        }

        return instance
    }

    private setNome(nome: string) {
        try {
            if (isEmpty(nome)) throw new ClienteException('O nome do cliente não pode ser nulo')
            if (!isString(nome)) throw new ClienteException('O cpf do cliente deve ser do tipo string')
            this.nome = nome
        } catch (e) {
            throw e
        }
    }

    private setCpf(cpf: string) {
        try {
            if (isEmpty(cpf)) throw new ClienteException('O cpf do cliente não pode ser nulo')
            if (!isString(cpf)) throw new ClienteException('O cpf do cliente deve ser do tipo string')
            if (!isLength(cpf, { min: 11, max: 11 }))
                throw new ClienteException('O cpf do cliente deve ter 11 dígitos.')
            if (!matches(cpf, /^\d{11}$/)) throw new ClienteException('O CPF deve conter apenas números.')
            this.cpf = cpf
        } catch (e) {
            throw e
        }
    }

    private setDataNascimento(dataNascimento: Date) {
        try {
            if (isEmpty(dataNascimento)) throw new ClienteException('A data de nascimento do cliente não pode ser nula')
            if (!isDate(dataNascimento))
                throw new ClienteException('A data de nascimento do cliente tem que ser do tipo Data')
            if (!maxDate(dataNascimento, new Date()))
                throw new ClienteException('A data de nascimento deve ser anterior à data atual.')

            this.dataNascimento = dataNascimento
        } catch (e) {
            throw e
        }
    }

    private setContas(contas: number[]) {
        try {
            if (isEmpty(contas)) throw new ClienteException('As contas do cliente não podem ser nulas')
            if (!isArray(contas)) throw new ClienteException('As contas do cliente devem ser do tipo array')
            if (!contas.every((item) => isNumber(item))) {
                throw new ClienteException('As contas do cliente devem ser apenas números')
            }
            this.contas = contas
        } catch (e) {
            throw e
        }
    }

    private setSenha(senha: string): void {
        try {
            if (isEmpty(senha)) throw new ClienteException('A senha do cliente não pode ser nula.')
            if (!isString(senha)) throw new ClienteException('A senha do cliente deve ser do tipo string.')
            if (!isLength(senha, { min: 8, max: 20 }))
                throw new ClienteException('A senha deve ter entre 8 e 20 caracteres.')
            if (!matches(senha, /\d/)) throw new ClienteException('A senha deve conter pelo menos um número.')
            if (!matches(senha, /[A-Z]/))
                throw new ClienteException('A senha deve conter pelo menos uma letra maiúscula.')
            if (!matches(senha, /[a-z]/))
                throw new ClienteException('A senha deve conter pelo menos uma letra minúscula.')
            if (!matches(senha, /[@$!%*?&#]/))
                throw new ClienteException(
                    'A senha deve conter pelo menos um caractere especial (@, $, !, %, *, ?, &, #).',
                )
            this.senha = bcrypt.hashSync(senha, 10)
        } catch (e) {
            throw e
        }
    }

    private async setSenhaCarregada(senha: string) {
        try {
            if (isEmpty(senha)) throw new ClienteException('A senha do cliente não pode ser nula')
            if (!isString(senha)) throw new ClienteException('O senha do cliente deve ser do tipo string')
            this.senha = senha
        } catch (e) {
            throw e
        }
    }

    public verificarSenha(senha: string): void {
        try {
            if (isEmpty(senha)) throw new ClienteException('A senha do cliente não pode ser nula.')
            if (!isString(senha)) throw new ClienteException('A senha do cliente deve ser do tipo string.')
            if (!isLength(senha, { min: 8, max: 20 }))
                throw new ClienteException('A senha deve ter entre 8 e 20 caracteres.')
            if (!matches(senha, /\d/)) throw new ClienteException('A senha deve conter pelo menos um número.')
            if (!matches(senha, /[A-Z]/))
                throw new ClienteException('A senha deve conter pelo menos uma letra maiúscula.')
            if (!matches(senha, /[a-z]/))
                throw new ClienteException('A senha deve conter pelo menos uma letra minúscula.')
            if (!matches(senha, /[@$!%*?&#]/))
                throw new ClienteException(
                    'A senha deve conter pelo menos um caractere especial (@, $, !, %, *, ?, &, #).',
                )
            const verificarSenha = bcrypt.compareSync(senha, this.senha)

            if (!verificarSenha) throw new SenhaInvalidaException('A senha do cliente está incorreta')
        } catch (e) {
            throw e
        }
    }

    public getSenha(): string {
        return this.senha
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
