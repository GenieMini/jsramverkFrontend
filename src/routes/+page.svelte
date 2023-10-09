<script>
    import { onMount } from 'svelte';
    import { renderMainView } from './utils';
    import DelayedTable from "./DelayedTable.svelte";
    import LeafletMap from "./LeafletMap.svelte";
    import { browser } from '$app/environment';
    import { delayz, user, delayz2 } from '$lib/stores/DelaysStore.js'
    
    // import StoreExample from '$lib/StoreExample.svelte';

    onMount(() => {
        // renderMainView();

        /*
        new DelayedTable({
            target: container,
            props: {delays: delayz}
        });
        */
	});
</script>

<!--
<p>{$user.username}</p>
<p>{$delayz[0]["ActivityId"]}</p>
<p>{$delayz2[0]["ActivityId"]}</p>
-->



<div class="container" id="container">
    <DelayedTable delays={delayz2} />
    <LeafletMap delays={delayz2} />
</div>



<style>
    .container {
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: row;
    }
</style>
