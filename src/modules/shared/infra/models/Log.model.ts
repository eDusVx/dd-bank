import { DataType, PrimaryKey, Table, Model, Column } from 'sequelize-typescript'

@Table({
    tableName: 'log',
})
export class LogModel extends Model {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, allowNull: false })
    id: number

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    process: string

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    log: string

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    props: string

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    result: string

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    type: string
}
