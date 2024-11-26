import { LogModel } from './Log.model'

export const sharedModels = [LogModel]

export const modelsProviders = [
    {
        provide: 'LogModel',
        useValue: LogModel,
    },
]
