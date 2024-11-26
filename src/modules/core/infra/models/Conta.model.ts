import { Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { ClienteModel } from './Cliente.model'

@Table({
    tableName: 'conta_bancaria',
})
export class ContaBancariaModel extends Model {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    id: string

    @ForeignKey(() => ClienteModel)
    @Column
    clienteId: string

    @Column({ type: DataType.DECIMAL, defaultValue: 0 })
    saldo: number

    @Column
    status: string
}
