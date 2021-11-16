<script lang="ts">
    import { createEventDispatcher } from "svelte"
    import { delay } from "$lib/functions/delay"

    const dispatch = createEventDispatcher()

    export let hovering = false
    export let enterDelay = 0
    export let leaveDelay = 0

    let _hovering = false

    async function enter() {
        _hovering = true
        await delay(enterDelay)
        if (_hovering !== true) return
        hovering = true
        dispatch("enter")
    }

    async function leave() {
        _hovering = false
        await delay(leaveDelay)
        if (_hovering !== false) return
        hovering = false
        dispatch("leave")
    }
</script>

<div {...$$restProps} on:pointerenter={enter} on:pointerleave={leave}>
    <slot {hovering} />
</div>
