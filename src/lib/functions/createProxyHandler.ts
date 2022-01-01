import type { Request, Handle, Response } from "@sveltejs/kit"
import type { StrictBody } from "@sveltejs/kit/types/hooks"

export interface ProxyHandlerConfig {
    proxy: (request: Request) => Request
    transformResponse?: (response: Response) => Response
}

export function createProxyHandler({
    proxy,
    transformResponse = response => response
}: ProxyHandlerConfig): Handle {
    return async ({ request, resolve }) => {
        const mapping = proxy(request)

        if (!mapping) return await resolve(request)

        let { method, rawBody, headers, url } = mapping

        const init: RequestInit = { method, headers }

        if (rawBody) init.body = rawBody

        const response = await fetch(url.toString(), init)

        let body: StrictBody
        try {
            body = new Uint8Array(await response.arrayBuffer())
        } catch (error) {}

        return transformResponse({
            status: response.status,
            headers: Object.fromEntries(response.headers.entries()),
            body
        })
    }
}
