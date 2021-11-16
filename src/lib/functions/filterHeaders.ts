export function filterHeaders(
    headers: HeadersInit,
    predicate: (header: string, value: string) => boolean
) {
    if (headers.forEach) {
        const obj = new Headers(headers)
        const toRemove = new Set<string>()
        obj.forEach((value, key) => {
            if (!predicate(key, value)) toRemove.add(key)
        })
        return obj
    } else {
        let entries: string[][]

        if (Array.isArray(headers)) entries = headers
        else entries = Object.entries(headers)

        return Object.fromEntries(entries.filter(([key, value]) => predicate(key, value)))
    }
}
