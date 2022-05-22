export async function preloadImage(src: string) {
    const image = new Image()
    await new Promise((onload, onerror) =>
        Object.assign(image, {
            onload,
            onerror,
            src
        })
    )
    return src
}
