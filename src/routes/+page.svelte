<script>
    
    import { onMount } from 'svelte';
    import { renderLoginView } from './utils';
    
    onMount(() => {
        renderLoginView();
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
