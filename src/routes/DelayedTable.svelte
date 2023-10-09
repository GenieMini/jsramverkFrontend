<script>
    export let delays;
    // console.log(delays);

    // import { ROUTES, getData } from './utils';
    // import { delays } from './utils';
    import DelayedItem from './DelayedItem.svelte';
    // import { delayz, user, delayz2 } from '$lib/stores/DelaysStore.js'
    

    // const delays = getData(ROUTES.DELAYS);
</script>

<div class="delayed">
    <h1>Försenade tåg</h1>

    <div id="delayed-trains" class="delayed-trains">

        {#each $delays as delay}
	        <DelayedItem bind:data={delay}/>
        {/each}



        <!--
        {#await delays}
        <p>Fetching data...</p>
    {:then delays}
        {#each delays as delay}
            <DelayedItem bind:data={delay}></DelayedItem>
        {/each}
    {/await}
    -->

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