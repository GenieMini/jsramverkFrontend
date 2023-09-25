<script>
    // export let port;

    import { ROUTES, getData } from './utils';
    import DelayedItem from './DelayedItem.svelte';

    const delays = getData(ROUTES.DELAYS);
</script>

<div class="delayed">
    <h1>Försenade tåg</h1>

    <div id="delayed-trains" class="delayed-trains">
        {#await delays}
	        <p>Fetching data...</p>
        {:then delays}
            {#each delays as delay}
                <DelayedItem data={delay}></DelayedItem>
            {/each}
        {/await}
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

    .delayed-trains {
        display: flex;
        flex-direction: column;
    }

    div :global(.delayed-trains > div) {
        display: flex;
        flex-direction: row;
        border-top: 1px solid #ccc;
        padding: 0.2rem 0.8rem;
        align-items: center;
        cursor: pointer;
    }

    div :global(.delayed-trains > div:nth-of-type(2n)) {
        background-color: #eee;
    }
</style>