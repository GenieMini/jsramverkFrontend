<script>
    import DelayedTable from './DelayedTable.svelte';
    import LeafletMap from './LeafletMap.svelte';
</script>

<div class="container" id="container">
    <DelayedTable port=1337 />
    <LeafletMap port=1337 />
</div>

<!-- Style applied only to current page/component -->
<style>
    .container {
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: row;
    }
</style>
