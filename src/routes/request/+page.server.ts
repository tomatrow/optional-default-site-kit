/** @type {import("./$types").RequestHandler} */
export async function GET() {
    return new Response(
        JSON.stringify({
            message: `Hello to the world!`
        })
    )
}
