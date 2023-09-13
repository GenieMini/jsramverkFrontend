<script>
    export let data;

    import DelayedTable from "./DelayedTable.svelte";
    import LeafletMap from "./LeafletMap.svelte";

    // let newTicketId = 0;

    var locationString = "";

    if (data.FromLocation) {
         locationString = `Tåg från ${data.FromLocation[0].LocationName} till ${data.ToLocation[0].LocationName}. Just nu i ${data.LocationSignature}.`;
    }

    // Duplicate
    function outputDelay(item) {
        let advertised = new Date(item.AdvertisedTimeAtLocation);
        let estimated = new Date(item.EstimatedTimeAtLocation);

        const diff = Math.abs(estimated - advertised);

        return Math.floor(diff / (1000 * 60)) + " minuter";
    }

    function renderMainView() {
        let container = document.getElementById("container");

        // Remove existing children from container
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        // Append new components to container
        const delayedTable = new DelayedTable({
            target: container,
            props: {port: 1337}
        });

        const leafletMap = new LeafletMap({
            target: container,
            props: {port: 1337}
        });
    }
</script>

<div class="ticket-container">
    <div class="ticket">
        <a on:click={renderMainView} on:keypress={renderMainView} role="button" tabindex="0" href="" id="back">&larr; Tillbaka</a>

        <h1>Nytt ärende #<span id="new-ticket-id"></span></h1>
        
        <h3>{locationString}</h3>

        <p><strong>Försenad:</strong> {outputDelay(data)}</p>

        <form id="new-ticket-form">
            <label>Orsakskod</label><br>
            <select id="reason-code"></select><br><br>
            <input type="submit" value="Skapa nytt ärende" />
        </form>
    </div>
    <br>

    <div class="old-tickets" id="old-tickets">
        <h2>Befintliga ärenden</h2>
    </div>
</div>

<style>
    .ticket-container {
        padding: 2rem;
    }
</style>