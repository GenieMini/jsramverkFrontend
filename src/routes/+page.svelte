<script>
    import { delays } from '$lib/stores/DelayStore.js';
    import { onMount } from 'svelte';
    import { setDelays, renderMainView } from './utils';

    onMount(() => {
        setDelays(delays);
        renderMainView();
	});
</script>

<div class="container" id="container"></div>

<style>
    .container {
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: row;
    }
</style>
