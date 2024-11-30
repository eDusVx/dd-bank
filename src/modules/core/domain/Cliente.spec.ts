import { Cliente } from './Cliente'
import { ClienteException } from './exceptions/Cliente.exception'
import { SenhaInvalidaException } from './exceptions/SenhaInvalida.excpetion'

describe('Cliente', () => {
    describe('Criação do Cliente', () => {
        it('deve criar um cliente com dados válidos', () => {
            const clienteProps = {
                cpf: '12345678901',
                nome: 'João Silva',
                dataNascimento: new Date('1990-01-01'),
                senha: 'Senha@1234',
            }

            const cliente = Cliente.criar(clienteProps)

            expect(cliente.getCpf()).toBe(clienteProps.cpf)
            expect(cliente.getNome()).toBe(clienteProps.nome)
            expect(cliente.getDataNascimento()).toEqual(clienteProps.dataNascimento)
            expect(cliente.getContas()).toEqual([])
            expect(cliente.getSenha()).toBeDefined()
        })

        it('deve criar um cliente com dados válidos e retornar seu dto corretamente', () => {
            const clienteProps = {
                cpf: '12345678901',
                nome: 'João Silva',
                dataNascimento: new Date('1990-01-01'),
                senha: 'Senha@1234',
            }

            const cliente = Cliente.criar(clienteProps)

            expect(cliente.toDTO()).toStrictEqual({
                cpf: clienteProps.cpf,
                nome: clienteProps.nome,
                dataNascimento: clienteProps.dataNascimento,
                contas: [],
            })
        })

        it('deve lançar erro se o CPF for inválido', () => {
            const clienteProps = {
                cpf: '1234',
                nome: 'João Silva',
                dataNascimento: new Date('1990-01-01'),
                senha: 'Senha@1234',
            }

            expect(() => Cliente.criar(clienteProps)).toThrow(ClienteException)
        })

        it('deve lançar erro se o nome for vazio', () => {
            const clienteProps = {
                cpf: '12345678901',
                nome: '',
                dataNascimento: new Date('1990-01-01'),
                senha: 'Senha@1234',
            }

            expect(() => Cliente.criar(clienteProps)).toThrow(ClienteException)
        })

        it('deve lançar erro se a senha não tiver pelomenos 1 letra minúscula', () => {
            const clienteProps = {
                cpf: '12345678901',
                nome: 'João Silva',
                dataNascimento: new Date('1990-01-01'),
                senha: 'SENHA123',
            }

            expect(() => Cliente.criar(clienteProps)).toThrow(ClienteException)
        })

        it('deve lançar erro se a senha não tiver pelomenos 1 caracter especial', () => {
            const clienteProps = {
                cpf: '12345678901',
                nome: 'João Silva',
                dataNascimento: new Date('1990-01-01'),
                senha: 'SENHa123',
            }

            expect(() => Cliente.criar(clienteProps)).toThrow(ClienteException)
        })

        it('deve lançar erro se a senha carregada for inválida', () => {
            const clienteProps = {
                cpf: '12345678901',
                nome: 'João Silva',
                dataNascimento: new Date('1990-01-01'),
                senha: 12345 as any,
                contas: [],
            }

            expect(() => Cliente.carregar(clienteProps)).toThrow(ClienteException)
        })

        it('deve lançar erro se a senha for inválida', () => {
            const clienteProps = {
                cpf: '12345678901',
                nome: 'João Silva',
                dataNascimento: new Date('1990-01-01'),
                senha: 'senha123',
            }

            expect(() => Cliente.criar(clienteProps)).toThrow(ClienteException)
        })

        it('deve lançar erro se a data de nascimento for inválida', () => {
            const clienteProps = {
                cpf: '12345678901',
                nome: 'João Silva',
                dataNascimento: new Date('3000-01-01'),
                senha: 'senha123',
            }

            expect(() => Cliente.criar(clienteProps)).toThrow(ClienteException)
        })
    })

    describe('Carregar Cliente', () => {
        it('deve carregar um cliente com dados válidos', () => {
            const clienteProps = {
                cpf: '12345678901',
                nome: 'João Silva',
                dataNascimento: new Date('1990-01-01'),
                contas: [1234, 5678],
                senha: 'Senha@1234',
            }

            const cliente = Cliente.carregar(clienteProps)

            expect(cliente.getCpf()).toBe(clienteProps.cpf)
            expect(cliente.getNome()).toBe(clienteProps.nome)
            expect(cliente.getDataNascimento()).toEqual(clienteProps.dataNascimento)
            expect(cliente.getContas()).toEqual(clienteProps.contas)
        })

        it('deve retornar erro caso os array de contas não sejam array de numeros', () => {
            const clienteProps = {
                cpf: '12345678901',
                nome: 'João Silva',
                dataNascimento: new Date('1990-01-01'),
                contas: ['1', '2'] as any,
                senha: 'Senha@1234',
            }

            expect(() => Cliente.carregar(clienteProps)).toThrow(ClienteException)
        })

        it('deve retornar erro aoc arregar um cliente com dados invalido', () => {
            const clienteProps = {
                cpf: 1 as any,
                nome: 'João Silva',
                dataNascimento: new Date('1990-01-01'),
                contas: [1234, 5678],
                senha: 'Senha@1234',
            }

            expect(() => Cliente.carregar(clienteProps)).toThrow(ClienteException)
        })

        it('deve retornar erro ao carregar um cliente com contas invalidas', () => {
            const clienteProps = {
                cpf: 1 as any,
                nome: 'João Silva',
                dataNascimento: new Date('1990-01-01'),
                contas: ['1', '2'],
                senha: 'Senha@1234',
            }

            expect(() => Cliente.carregar(clienteProps as any)).toThrow(ClienteException)
        })
    })

    describe('Verificação de Senha', () => {
        it('deve verificar a senha corretamente', () => {
            const clienteProps = {
                cpf: '12345678901',
                nome: 'João Silva',
                dataNascimento: new Date('1990-01-01'),
                senha: 'Senha@1234',
            }

            const cliente = Cliente.criar(clienteProps)
            cliente.verificarSenha('Senha@1234')

            expect(() => cliente.verificarSenha('Senha@12345')).toThrow(SenhaInvalidaException)
        })

        it('deve lançar erro se a senha fornecida para verificação for nula', () => {
            const clienteProps = {
                cpf: '12345678901',
                nome: 'João Silva',
                dataNascimento: new Date('1990-01-01'),
                senha: 'Senha@1234',
            }

            const cliente = Cliente.criar(clienteProps)

            expect(() => cliente.verificarSenha(null)).toThrow(ClienteException)
        })
    })
})
