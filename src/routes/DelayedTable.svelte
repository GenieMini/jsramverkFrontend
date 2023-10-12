<script>
    export let delays;

    import DelayedItem from './DelayedItem.svelte';
</script>

<div class="delayed">
    <h1>Försenade tåg</h1>

    <div id="delayed-trains" class="delayed-trains">
        {#each $delays as delay}
	        <DelayedItem data={delay}/>
        {/each}
    </div>
</div>

<style>
    .delayed {
        height: 100vh;
        width: 40vw;
        padding: 2rem;
        overflow: scroll;
        background-color: #fff;
    }

    div :global(.delayed-trains > div:nth-of-type(2n)) {
        background-color: #eee;
    }
</style>