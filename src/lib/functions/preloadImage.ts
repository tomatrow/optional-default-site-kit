export async function preloadImage(href: string) {
    await new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = resolve
        image.onerror = reject
        image.src = href
    })
    return href
}
