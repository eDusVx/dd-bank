import { Column, DataType, ForeignKey, Model, PrimaryKey, Table, BelongsTo } from 'sequelize-typescript'
import { ContaBancariaModel } from './Conta.model'
import { TIPO_MOVIMENTACAO } from '../../domain/MovimentacaoFinanceira'

@Table({
    tableName: 'movimentacao_financeira',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})
export class MovimentacaoFinanceiraModel extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        field: 'id',
        allowNull: false,
    })
    id: string

    @ForeignKey(() => ContaBancariaModel)
    @Column({
        field: 'numero_conta_origem',
        allowNull: true,
    })
    contaOrigemId: number

    @ForeignKey(() => ContaBancariaModel)
    @Column({
        field: 'numero_conta_destino',
        allowNull: true,
    })
    contaDestinoId: number

    @Column({
        type: DataType.ENUM(...Object.values(TIPO_MOVIMENTACAO)),
        field: 'tipo',
        allowNull: false,
    })
    tipo: TIPO_MOVIMENTACAO

    @Column({
        type: DataType.DECIMAL,
        field: 'valor',
        allowNull: false,
        get() {
            const value = this.getDataValue('valor')
            return parseFloat(value)
        },
    })
    valor: number

    @Column({
        type: DataType.DATE,
        field: 'data_hora',
        allowNull: false,
    })
    dataHora: Date

    @BelongsTo(() => ContaBancariaModel, { foreignKey: 'contaOrigemId' })
    contaOrigem: ContaBancariaModel

    @BelongsTo(() => ContaBancariaModel, { foreignKey: 'contaDestinoId' })
    contaDestino: ContaBancariaModel
}
