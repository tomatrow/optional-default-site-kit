import type { Action } from "$lib/types/action"

function resize(input: HTMLElement) {
    input.style.height = "1px"
    input.style.height = +input?.scrollHeight + "px"
}

export const autoResizeTextArea: Action<number> = node => {
    resize(node)
    node.style.overflow = "hidden"

    function onInput({ target }: Event) {
        resize(target as HTMLElement)
    }

    node.addEventListener("input", onInput)

    return {
        destroy() {
            node.removeEventListener("input", onInput)
        }
    }
}
