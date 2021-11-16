export function explodePromise<Value = unknown>() {
    let resolve: (value?: Value) => void
    let reject: () => void

    const promise = new Promise<Value>((res, rej) => {
        resolve = res
        reject = rej
    })

    return { promise, resolve, reject }
}
