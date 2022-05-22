<script lang="ts">
    import { onMount } from "svelte"
    import { request } from "$lib/functions"
    import { RequestError } from "$lib/functions"

    onMount(async () => {
        try {
            const response = await request("/api/request.json", {
                headers: {
                    hello: "world",
                    accept: "application/json",
                }
            })

            console.log({ response })
        } catch (error) {
            console.error(error)
            if (error instanceof RequestError) {
                const { name, message, init, response } = error
                // const value = await content
                console.log({ name, message, init, response })
            }
        }
    })
</script>
