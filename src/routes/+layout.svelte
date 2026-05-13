<script lang="ts">
    import './layout.css';
    import favicon from '$lib/assets/favicon.svg';
    import { page } from '$app/stores';
    import { currentUser } from '$lib/store';
    // Ya no necesitas onMount para esta sincronización básica

    let { children } = $props();

    // Reemplazamos $: por $effect
    $effect(() => {
        currentUser.set($page.data.user);
    });
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

{@render children()}