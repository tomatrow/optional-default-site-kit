import type { Action } from "$lib/types/action"

import type { BuildExpression } from "$lib/functions/build"

type BuildExpressionMaybeList = BuildExpression | BuildExpression[]

function parseBuildExpressions(listOrSingleton: BuildExpressionMaybeList) {
    const list = Array.isArray(listOrSingleton) ? listOrSingleton : [listOrSingleton]
    return list
        .filter(Boolean)
        .flatMap((x: string) => x?.split(" "))
        .filter(Boolean)
}

export const classes: Action<BuildExpressionMaybeList> = (node, listOrSingleton) => {
    let last: string[] = []

    function update(listOrSingleton: BuildExpressionMaybeList = []) {
        node.classList.remove(...last)

        const next = parseBuildExpressions(listOrSingleton)

        node.classList.add(...next)

        last = next
    }

    update(listOrSingleton)

    return {
        update
    }
}
