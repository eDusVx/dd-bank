import { DataType, PrimaryKey, Table, Model, Column } from 'sequelize-typescript'
import { LOG_TYPE } from '../repositories/Log.repository'

@Table({
    tableName: 'log',
})
export class LogModel extends Model {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, allowNull: false })
    id: string

    @Column({
        type: DataType.STRING,
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
        type: DataType.ENUM(...Object.values(LOG_TYPE)),
        allowNull: false,
    })
    type: LOG_TYPE
}
