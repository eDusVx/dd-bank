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
        const handlerName = context.getHandler().name

        const process = `${handlerName}`
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

        this.logger.debug(`Iniciando execução de ${handlerName} com parâmetros: ${props}`)
        this.logService.log({
            process,
            log: `O processo ${handlerName} foi iniciado com os parâmetros: ${props}`,
            props,
        })

        return next.handle().pipe(
            tap((response) => {
                const result = JSON.stringify(response)
                this.logger.debug(`${handlerName} executado com sucesso com parâmetros: ${props}`)
                this.logService.log({
                    process,
                    log: `O processo ${handlerName} foi finalizado com sucesso`,
                    props,
                    result,
                })
            }),
            catchError((error) => {
                this.logger.error(`${handlerName} executado com falha: ${error.message}`)
                this.logService.error({
                    process,
                    log: `O processo ${handlerName} finalizou com o erro ${error.message}`,
                    props,
                    result: JSON.stringify(error.response),
                })
                throw error
            }),
        )
    }
}
