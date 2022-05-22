<script lang="ts">
    import { getLevel } from "./utility"

    const naturalLevel = getLevel()

    export let level = naturalLevel

    $: tag = "h" + Math.min(Math.max(level, 1), 6)
</script>

<svelte:element this={tag} {...$$restProps}>
    <slot />
</svelte:element>
