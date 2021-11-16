import type { RequestHandler } from "@sveltejs/kit"

type Fetch = typeof fetch

let installedFetch: Fetch

export function installFetch(newFetch: Fetch) {
    installedFetch = newFetch
}

export type Method = "get" | "put" | "post" | "patch" | "delete"

export interface RequestConfig<Body = any> {
    method?: Method
    body?: Body
    headers?: HeadersInit
    fetch?: typeof fetch
}

async function getContent(response: Response) {
    const contentType = response.headers.get("content-type")
    if (contentType?.match(/application\/json/)) return await response.json()
    else if (contentType?.match(/text\/plain/)) return await response.text()
    else if (contentType?.match(/multipart\/form-data/)) return await response.formData()
    else return await response.blob()
}

export type Request = <Input, Output>(url: string, config?: RequestConfig<Input>) => Promise<Output>

export const request: Request = async (url, config = {}) => {
    const { body } = config
    const headers = new Headers(config.headers ?? {})

    const init: RequestInit = {
        method: config.method ?? (body ? "post" : "get"),
        headers
    }

    if (body) {
        init.body = typeof body === "string" ? body : JSON.stringify(body)
        if (!headers.has("content-type")) headers.set("content-type", "application/json")
    }

    const fetch = config.fetch ?? installedFetch
    if (!fetch) throw new Error("Fetch not resolved")

    const response = await fetch(url, init)

    if (response.status < 200 || response.status >= 300) {
        const info = {
            status: response.status,
            error: response.statusText,
            url,
            /* @ts-ignore */
            headers: Array.from(headers.entries()).reduce(
                (acc, [key, value]) => ((acc[key] = value), acc),
                {}
            ),
            method: init.method,
            content: null
        }

        try {
            info.content = await getContent(response)
        } catch (error) {
            console.error(error)
        }

        return Promise.reject(info)
    }

    return await getContent(response)
}

export type UnpackHandler<Handler> = Handler extends RequestHandler<
    infer Locals,
    infer Input,
    infer Output
>
    ? { locals: Locals; input: Input; output: Output }
    : unknown

export type ServerRequest = <Handler extends RequestHandler = RequestHandler>(
    url: string,
    config?: RequestConfig<UnpackHandler<Handler>["input"]>
) => Promise<UnpackHandler<Handler>["output"]>

export const serverRequest: ServerRequest = request
