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
        type: DataType.STRING,
        field: 'conta_origem_id',
        allowNull: false,
    })
    contaOrigemId: string

    @ForeignKey(() => ContaBancariaModel)
    @Column({
        type: DataType.STRING,
        field: 'conta_destino_id',
        allowNull: false,
    })
    contaDestinoId: string

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
    })
    valor: number

    @Column({
        type: DataType.DATE,
        field: 'data_hora',
        allowNull: false,
    })
    dataHora: Date

    @BelongsTo(() => ContaBancariaModel, 'conta_origem_id')
    contaOrigem: ContaBancariaModel
}
