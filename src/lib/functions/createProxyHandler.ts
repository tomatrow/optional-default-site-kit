import type { Handle, RequestEvent } from "@sveltejs/kit"

export interface ProxyHandlerConfig {
    proxy: (request: RequestEvent) => RequestEvent
    transformResponse?: (response: Response) => Response
}

export function createProxyHandler({
    proxy,
    transformResponse = response => response
}: ProxyHandlerConfig): Handle {
    return async ({ event, resolve }) => {
        const mapping = proxy(event)

        if (!mapping) return await resolve(event)

        const { url, request } = mapping

        return transformResponse(await fetch(url.toString(), request))
    }
}
