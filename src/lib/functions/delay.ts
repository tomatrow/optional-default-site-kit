export async function delay(ms: number = 0) {
    if (!ms) return
    await new Promise<void>(resolve => setTimeout(resolve, ms))
}
