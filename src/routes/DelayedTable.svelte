<script>
    //export let port;

    // import { onMount } from 'svelte';
    import DelayedItem from './DelayedItem.svelte';
    import { DEV } from 'esm-env';

    const backend_url = DEV
        ? "http://localhost:1337/"
        : "https://jsramverk-editor-shou21.azurewebsites.net/";

    let promise = getDelayData();

    async function getDelayData() {
        const res = await fetch(`${backend_url}delayed`)
            .then((response) => response.json())
            .then(function(result) {
                return result.data;
            });

        return res;
    }

    /*
    onMount(() => {
	});
    */
</script>

<div class="delayed">
    <h1>Försenade tåg</h1>

    <div id="delayed-trains" class="delayed-trains">
        {#await promise}
	        <p>Fetching data...</p>
        {:then datas}
            {#each datas as item}
                <DelayedItem data={item}></DelayedItem>
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