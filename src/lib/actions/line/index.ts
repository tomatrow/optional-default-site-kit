import type { Action } from "$lib/types/action"
import "./index.postcss"
import _ from "lodash"

export interface LineConfig {
    origin: string
    maxWidth: string
    force: boolean
    scale: number
    color: string
    track: boolean
}

export type LineActionConfig = boolean | Partial<LineConfig>

const name = "line-decoration"

export const line: Action<LineActionConfig> = (node, config) => {
    function update(config: LineActionConfig) {
        const _config: Partial<LineConfig> = typeof config === "object" ? config : {}
        node.classList.add(name)
        node.classList[_config?.force ? "add" : "remove"]("active-line")
        node.classList[_config?.track ? "add" : "remove"]("track-line")
        Object.entries(_config)
            .filter(([key]) => !["force"].includes(key))
            .forEach(([key, value]) => {
                node.style.setProperty(`--line-${_.kebabCase(key)}`, String(value))
            })
    }
    update(config)
    return {
        update
    }
}
