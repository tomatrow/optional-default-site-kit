<script context="module" lang="ts">
    import type { Load } from "./__types/__layout"
    import { installFetch } from "$lib"
    import "../app.css"

    export const load: Load = async ({ fetch }) => {
        installFetch(fetch)
        return { status: 200 }
    }
</script>

<slot />
