import type { JSONValue } from "@sveltejs/kit/types/private"

type Fetch = typeof fetch
type Headers = RequestInit["headers"] | Record<string | number, any>
type ArrayHeaders = string[][]
type Content = ArrayBuffer | FormData | JSONValue
type Cancellable = { cancel: AbortController["abort"] }

let installedFetch: Fetch

export function installFetch(newFetch: Fetch) {
    installedFetch = newFetch
}

export type Method = "get" | "put" | "post" | "patch" | "delete"

export interface RequestConfig<Body = any>
    extends Omit<RequestInit, "method" | "body" | "headers"> {
    method?: Method
    headers?: Headers
    body?: Body
    fetch?: Fetch
}

async function getContent(response: Response, headers: ArrayHeaders = []): Promise<Content> {
    const accepts =
        headers
            .find(([header]) => header.toLowerCase() === "accept")?.[1]
            .toLowerCase()
            .split(",") ?? []

    // prettier-ignore
    const mimes = [
        // force content type if there is only one accept
        accepts.length === 1 && accepts[0],
        response.headers.get("content-type")
    ].filter(
        Boolean
    ) as string[]

    const method =
        mimes
            .map(mime =>
                mime.match(/text\/plain/)
                    ? "text"
                    : mime.match(/application\/json/)
                    ? "json"
                    : mime.match(/multipart\/form-data/)
                    ? "formData"
                    : null
            )
            .find(Boolean) ?? "arrayBuffer"

    return response[method]()
}

export type Request = <Input, Output = Content>(
    url: string,
    config?: RequestConfig<Input>
) => Promise<Output> & Cancellable

export const request: Request = (url, { body, headers, method, signal, ...init } = {}) => {
    const fetch = init.fetch ?? installedFetch ?? globalThis?.fetch
    if (!fetch) throw new Error("Fetch not resolved")
    delete init.fetch

    headers = normalizeHeaders(headers)

    // convert body to post json by default
    if (body && typeof body !== "string") {
        // @ts-ignore
        body = JSON.stringify(body)
        headers.push(["content-type", "application/json"])
    }

    // easy cancelling if no signal is passed
    let cancel: AbortController["abort"] = () => {}
    if (!signal) {
        const controller = new AbortController()
        signal = controller.signal
        cancel = controller.abort.bind(controller)
    }

    // apply all the defaults
    Object.assign(init, {
        method: method ?? (body ? "post" : "get"),
        headers,
        // @ts-ignore
        body,
        signal
    })

    return Object.assign(_fetch(url, init), { cancel })
}

async function _fetch(url: string, init: RequestInit) {
    const response = await fetch(url, init)
    // throw for non 2xx codes
    if (response.status < 200 || response.status >= 300) throw new RequestError(init, response)
    return (await getContent(response, init.headers as ArrayHeaders)) as any
}

export interface RequestError {
    init: RequestInit
    response: Response
    content: ReturnType<typeof getContent>
}

export class RequestError extends Error {
    constructor(init: RequestInit, response: Response) {
        super(response.statusText)
        Object.assign(this, {
            name: `Response ${response.status}`,
            init,
            response,
            get content() {
                return getContent(response, init.headers as ArrayHeaders)
            }
        })
    }
}

function normalizeHeaders(headers: Headers = []): ArrayHeaders {
    return headers?.forEach
        ? // @ts-ignore
          [...headers.entries()]
        : !Array.isArray(headers)
        ? Object.entries(headers).map(([key, value]) => [key, String(value)])
        : headers
}
