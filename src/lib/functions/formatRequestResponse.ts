import type { RequestEvent } from "@sveltejs/kit/types/internal"
import type { Handle } from "@sveltejs/kit"

interface BuildConfig {
    separator?: string
    replacement?: string
    values: any[]
}

interface FormatterConfig extends Omit<BuildConfig, "values"> {
    headers?: string[]
}

function get_header<T>(headers: Record<string, T>, header: string) {
    return Object.entries(headers).find(([key]) => key.toLowerCase().includes(header.toLowerCase()))?.[1]
}

function build_log({ separator = " ", replacement = "-", values }: BuildConfig) {
    return values.map(value => value ?? replacement).join(separator)
}

function build_headers(headers: Record<string, any>, names: string[]) {
    return names.map(name => get_header(headers, name))
}

export function formatRequest({
    event: { url, request },
    headers: headerNames = ["referer", "content-type", "user-agent"],
    ...buildConfig
}: FormatterConfig & { event: RequestEvent }) {
    return build_log({
        ...buildConfig,
        values: [
            request.method,
            url.toString(),
            ...build_headers(request.headers, headerNames)
        ]
    })
}

export function formatResponse({
    response: { status, headers },
    headers: headerNames = ["content-type", "content-length"],
    ...buildConfig
}: FormatterConfig & { response: Response }) {
    return build_log({
        ...buildConfig,
        values: [status, ...build_headers(headers, headerNames)]
    })
}

interface CreateHandlerInput {
    requestHeaders?: string[]
    responseHeaders?: string[]
    log?: Function
}


type CreateHandler = (input: CreateHandlerInput) => Handle

export const createHandler: CreateHandler = ({
    requestHeaders,
    responseHeaders,
    log = console.log
} = {}) => {
    return async function handleLog({ event, resolve }) {
        log(formatRequest({ event, headers: requestHeaders }))
        const response = await resolve(event)
        log(formatResponse({ response, headers: responseHeaders }))
        return response
    }
}
