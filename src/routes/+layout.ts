import type { LayoutLoad } from "./$types"
import { installFetch } from "$lib"
import "../app.css"

type Fetch = typeof fetch

export const load: LayoutLoad = ({ fetch }) => {
    installFetch(fetch as Fetch)
}
