import type { RequestHandler } from "./__types/request"

export const get: RequestHandler = async () => {
    return {
        body: {
            message: `
                 Hello to the world!
            `
        }
    }
}
