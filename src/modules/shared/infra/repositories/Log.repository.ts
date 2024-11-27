import { Inject, Injectable } from '@nestjs/common'
import { LogProps, LogRepository } from '../../domain/repositories/Log.repository'
import { LogModel } from '../models/Log.model'

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
            type: 'log',
            props: props.props,
            result: props.result,
        })
    }

    async success(props: LogProps): Promise<void> {
        await this.logModel.create({
            process: props.process,
            log: JSON.stringify(props.log),
            type: 'success',
            props: props.props,
            result: props.result
        })
    }

    async error(props: LogProps): Promise<void> {
        await this.logModel.create({
            process: props.process,
            log: JSON.stringify(props.log),
            type: 'error',
            props: props.props,
            result: props.result
        })
    }

    async warning(props: LogProps): Promise<void> {
        await this.logModel.create({
            process: props.process,
            log: JSON.stringify(props.log),
            type: 'warning',
            props: props.props,
            result: props.result
        })
    }
}
