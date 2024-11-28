import { Column, DataType, Model, PrimaryKey, Table, HasMany } from 'sequelize-typescript'
import { ContaBancariaModel } from './Conta.model'

@Table({
    tableName: 'cliente',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})
export class ClienteModel extends Model {
    @PrimaryKey
    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'cpf',
    })
    cpf: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'nome',
    })
    nome: string

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'data_nascimento',
    })
    dataNascimento: Date

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: 'senha',
    })
    senha: string

    @HasMany(() => ContaBancariaModel)
    contas: ContaBancariaModel[]
}
