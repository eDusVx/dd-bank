export interface LogServiceProps {
    process: string
    log: any
    props: string
    result?: string
}

export interface LogService {
    error(props: LogServiceProps): Promise<void>
    warning(props: LogServiceProps): Promise<void>
    log(props: LogServiceProps): Promise<void>
    success(props: LogServiceProps): Promise<void>
}
