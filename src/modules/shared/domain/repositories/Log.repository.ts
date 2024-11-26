export interface LogProps {
    key: string
    log: any
    props: string
    result?: string
}

export interface LogRepository {
    error(props: LogProps): Promise<void>
    warning(props: LogProps): Promise<void>
    log(props: LogProps): Promise<void>
    success(props: LogProps): Promise<void>
}
