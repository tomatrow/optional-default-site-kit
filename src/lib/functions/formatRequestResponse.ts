import type { Request, Response } from "@sveltejs/kit"

interface BuildConfig {
    separator?: string
    replacement?: string
    values: any[]
}

interface FormatterConfig extends Omit<BuildConfig, "values"> {
    headers?: string[]
}

function get_header<T>(headers: Record<string, T>, header: string) {
    return Object.entries(headers).find(([key]) => key.toLowerCase().includes(header))?.[1]
}

function build_log({ separator = " ", replacement = "-", values }: BuildConfig) {
    return values.map(value => value ?? replacement).join(separator)
}

function build_headers(headers: Record<string, any>, names: string[]) {
    return names.map(name => get_header(headers, name))
}

export function formatRequest({
    request: { method, host, path, query, headers, rawBody },
    headers: headerNames = ["referer", "content-type", "user-agent"],
    ...buildConfig
}: FormatterConfig & { request: Request }) {
    const search = query.toString()
    return build_log({
        ...buildConfig,
        values: [
            method,
            `${host}${path}` + (search ? "?" : "") + search,
            rawBody?.length,
            ...build_headers(headers, headerNames)
        ]
    })
}

export function formatResponse({
    response: { status, headers, body },
    headers: headerNames = ["content-type"],
    ...buildConfig
}: FormatterConfig & { response: Response }) {
    return build_log({
        ...buildConfig,
        values: [status, body?.length, ...build_headers(headers, headerNames)]
    })
}
