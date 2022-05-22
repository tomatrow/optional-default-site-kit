export async function delay(ms: number = 0) {
    await new Promise<void>(resolve => setTimeout(resolve, ms))
}
