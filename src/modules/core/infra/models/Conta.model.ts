import { Column, DataType, ForeignKey, Model, PrimaryKey, Table, HasMany, BelongsTo } from 'sequelize-typescript'
import { ClienteModel } from './Cliente.model'
import { STATUS_CONTA } from '../../domain/Conta'
import { MovimentacaoFinanceiraModel } from './MovimentacaoFinanceira.model'

@Table({
    tableName: 'conta_bancaria',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})
export class ContaBancariaModel extends Model {
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        allowNull: false,
        field: 'numero_conta',
    })
    numeroConta: number

    @ForeignKey(() => ClienteModel)
    @Column({
        field: 'cliente_id',
    })
    clienteId: string

    @Column({
        type: DataType.DECIMAL,
        defaultValue: 0,
        field: 'saldo',
    })
    saldo: number

    @Column({
        type: DataType.ENUM(...Object.values(STATUS_CONTA)),
        allowNull: false,
        field: 'status',
    })
    status: STATUS_CONTA

    @BelongsTo(() => ClienteModel)
    cliente: ClienteModel

    @HasMany(() => MovimentacaoFinanceiraModel, 'conta_origem_id')
    movimentacoes: MovimentacaoFinanceiraModel[]
}
