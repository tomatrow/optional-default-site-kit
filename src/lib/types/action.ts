export interface Action<Parameters = any> {
    (node: HTMLElement, parameters: Parameters): {
        update?: (parameters: Parameters) => void
        destroy?: () => void
    } | void
}
