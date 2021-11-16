export type BuildExpression = string | boolean

export function build(...expressions: BuildExpression[]) {
    return expressions.filter(Boolean).join(" ")
}
