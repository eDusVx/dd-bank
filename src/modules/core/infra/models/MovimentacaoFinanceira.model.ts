import { Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { ContaBancariaModel } from './Conta.model'

@Table({
    tableName: 'movimentacao_financeira',
})
export class MovimentacaoFinanceiraModel extends Model {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
    id: string

    @ForeignKey(() => ContaBancariaModel)
    @Column
    contaOrigemId: string

    @ForeignKey(() => ContaBancariaModel)
    @Column({ allowNull: true })
    contaDestinoId: string

    @Column
    tipo: string

    @Column
    valor: number

    @Column
    dataHora: Date
}
