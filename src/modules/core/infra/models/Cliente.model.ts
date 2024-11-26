import { Column, DataType, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript'

@Table({
    tableName: 'cliente',
})
export class ClienteModel extends Model {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, allowNull: false })
    id: string

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    nome: string

    @Unique
    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    cpf: string

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    dataNascimento: Date
}
