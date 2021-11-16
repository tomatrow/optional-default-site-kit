import { setContext, getContext } from "svelte-typed-context"
import type { InjectionKey } from "svelte-typed-context"
import type { HeadingContext } from "./index.type"

export const key: InjectionKey<HeadingContext> = Symbol("heading-level")

export function getLevel() {
    return getContext(key)?.level ?? 1
}

export function increment() {
    let context = getContext(key)
    context ??= { level: 0 }
    context.level += 1
    setContext(key, context)
    const { level } = context
    return level
}
