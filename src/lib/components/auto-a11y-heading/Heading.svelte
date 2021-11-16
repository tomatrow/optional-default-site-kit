<script lang="ts">
    import { getLevel } from "./utility"

    const naturalLevel = getLevel()

    export let level = naturalLevel
</script>

{#if level === 1}
    <h1 {...$$restProps}>
        <slot />
    </h1>
{:else if level === 2}
    <h2 {...$$restProps}>
        <slot />
    </h2>
{:else if level === 3}
    <h3 {...$$restProps}>
        <slot />
    </h3>
{:else if level === 4}
    <h4 {...$$restProps}>
        <slot />
    </h4>
{:else if level === 5}
    <h5 {...$$restProps}>
        <slot />
    </h5>
{:else}
    <h6 {...$$restProps}>
        <slot />
    </h6>
{/if}
