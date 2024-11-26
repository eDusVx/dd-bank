import { Inject, Injectable } from '@nestjs/common'
import { LogProps, LogRepository } from '../../domain/repositories/Log.repository'
import { LogService } from '../../domain/services/Log.service'

@Injectable()
export class LogServiceImpl implements LogService {
    constructor(
        @Inject('LogRepository')
        private readonly logRepository: LogRepository,
    ) {}

    async log(props: LogProps): Promise<void> {
        await this.logRepository.log(props)
    }

    async success(props: LogProps): Promise<void> {
        await this.logRepository.success(props)
    }

    async error(props: LogProps): Promise<void> {
        await this.logRepository.error(props)
    }

    async warning(props: LogProps): Promise<void> {
        await this.logRepository.warning(props)
    }
}
