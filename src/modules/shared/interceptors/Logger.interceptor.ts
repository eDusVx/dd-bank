import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Inject, Logger } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap, catchError } from 'rxjs/operators'
import { LogService } from '../domain/services/Log.service'

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    private logger = new Logger('UseCaseLogger')

    constructor(
        @Inject('LogService')
        private readonly logService: LogService,
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest()
        const controllerName = context.getClass().name
        const handlerName = context.getHandler().name

        const key = `${controllerName}#${handlerName}`
        const params: Record<string, any> = {}

        if (Object.keys(request.query).length > 0) {
            Object.assign(params, request.query)
        }
        if (Object.keys(request.params).length > 0) {
            Object.assign(params, request.params)
        }
        if (Object.keys(request.body).length > 0) {
            Object.assign(params, request.body)
        }

        const props = JSON.stringify(params)

        this.logger.debug(`Iniciando execução de ${controllerName}.${handlerName} com parâmetros: ${props}`)
        this.logService.log({
            key,
            log: `Handler ${handlerName} started`,
            props,
        })

        return next.handle().pipe(
            tap((response) => {
                const result = JSON.stringify(response)
                this.logger.debug(`${controllerName}.${handlerName} executado com sucesso com parâmetros: ${props}`)
                this.logService.log({
                    key,
                    log: `Handler ${handlerName} completed successfully`,
                    props,
                    result,
                })
            }),
            catchError((error) => {
                this.logger.error(`${controllerName}.${handlerName} executado com falha: ${error.message}`)
                this.logService.error({
                    key,
                    log: `Handler ${handlerName} failed`,
                    props,
                    result: null,
                })
                throw error
            }),
        )
    }
}
