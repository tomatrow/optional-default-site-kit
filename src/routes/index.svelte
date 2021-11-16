<script lang="ts">
    import { line, classes, anchor } from "$lib/actions"

    console.log({ line })
</script>

<h1 class="block" use:anchor={"yes"} use:classes={"p-4"}>Welcome to SvelteKit</h1>
<div class="flex">
    <a class="block p-4" use:line href="https://kit.svelte.dev">kit.svelte.dev</a>
</div>
