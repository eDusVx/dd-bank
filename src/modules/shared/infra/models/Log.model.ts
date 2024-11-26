import { DataType, PrimaryKey, Table, Model, Column } from 'sequelize-typescript'

export enum LOG_MODEL {
    TABLE_NAME = 'log',
    SCHEMA_NAME = 'autorizacao_verdecard',
    ID = 'id',
    LOG = 'log',
    KEY = 'key',
    TYPE = 'type',
    CREATED_AT = 'created_at',
    UPDATED_AT = 'updated_at',
}

export interface LogModelProps {
    log: string
    key: string
    type: string
}

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
    key: string

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
