<script>
    import { onMount } from 'svelte';
    import { renderMainView } from './utils';

    onMount(() => {
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
