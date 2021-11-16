import type { Action } from "$lib/types/action"

export const anchor: Action<string> = (node, id) => {
    let div: HTMLElement

    const destroy = () => div?.remove()

    const update = (id: any) => {
        if (!id) return destroy()

        if (!div) {
            div = document.createElement("div")
            div.style.top = "calc(-1*(var(--anchor-offset,0rem)))"
            div.style.position = "relative"
            node.prepend(div)
        }

        div.id = id
    }

    update(id)

    return {
        update,
        destroy
    }
}
