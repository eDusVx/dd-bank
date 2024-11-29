import { Inject, Injectable } from '@nestjs/common'
import { LogProps, LogRepository } from '../../domain/repositories/Log.repository'
import { LogModel } from '../models/Log.model'

export enum LOG_TYPE {
    LOG = 'LOG',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
    WARNING = 'WARNING',
}

@Injectable()
export class LogRepositoryImpl implements LogRepository {
    constructor(
        @Inject('LogModel')
        private readonly logModel: typeof LogModel,
    ) {}

    async log(props: LogProps): Promise<void> {
        await this.logModel.create({
            process: props.process,
            log: JSON.stringify(props.log),
            type: LOG_TYPE.LOG,
            props: props.props,
            result: props.result,
        })
    }

    async success(props: LogProps): Promise<void> {
        await this.logModel.create({
            process: props.process,
            log: JSON.stringify(props.log),
            type: LOG_TYPE.SUCCESS,
            props: props.props,
            result: props.result,
        })
    }

    async error(props: LogProps): Promise<void> {
        await this.logModel.create({
            process: props.process,
            log: JSON.stringify(props.log),
            type: LOG_TYPE.ERROR,
            props: props.props,
            result: props.result,
        })
    }

    async warning(props: LogProps): Promise<void> {
        await this.logModel.create({
            process: props.process,
            log: JSON.stringify(props.log),
            type: LOG_TYPE.WARNING,
            props: props.props,
            result: props.result,
        })
    }
}
