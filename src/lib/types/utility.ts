export type Typify<T> = { [K in keyof T]: Typify<T[K]> }

export type Await<T> = T extends PromiseLike<infer U> ? U : T

export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T
