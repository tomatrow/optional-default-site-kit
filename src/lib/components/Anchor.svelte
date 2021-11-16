<script lang="ts">
    export let id: string
</script>

{#if id}
    <div {id} class="relative" />
{/if}

<style>
    div {
        top: calc(-1 * (var(--anchor-offset, 0rem)));
    }
</style>
