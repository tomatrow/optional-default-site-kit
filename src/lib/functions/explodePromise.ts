export function explodePromise<Value = unknown>() {
    const promise = new Promise<Value>((resolve, reject) => {
        Object.assign(promise, {
            resolve,
            reject
        })
    })

    return promise
}
