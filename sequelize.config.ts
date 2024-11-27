import { Sequelize } from 'sequelize-typescript'
import { coreModels } from './src/modules/core/infra/models'
import { sharedModels } from './src/modules/shared/infra/models'

export const databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async () => {
            const sequelize = new Sequelize({
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT),
                dialect: 'postgres',
                logging: String(process.env.DB_LOGGING) == 'true',
            })

            sequelize.addModels([...coreModels, ...sharedModels])

            sequelize.sync()

            return sequelize
        },
    },
]
