import { getContext as _getContext, setContext as _setContext } from "svelte"

/**
 * Provided as key to getContext and setContext in order to enable strict typing
 */
export interface InjectionKey<T = unknown> {}

export const getContext: <T>(key: InjectionKey<T>) => undefined | T = _getContext
export const setContext: <T>(key: InjectionKey<T>, context: T) => void = _setContext
