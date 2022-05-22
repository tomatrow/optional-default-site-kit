import type { RequestHandler } from "./__types/request.json"

export const get: RequestHandler = async () => {
    return {
        status: 200,
        body: {
            message: "Hello world!"
        }
    }
}