<script>
    export let data;

    import TicketView from "./TicketView.svelte";

    function renderTicketView() {
        let container = document.getElementById("container");

        // Remove existing children from container before recreating them
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        const element = new TicketView({
			target: container,
            props: {data: data}
		});
    }

    // Calculate delay in minutes
    function outputDelay(item) {
        let advertised = new Date(item.AdvertisedTimeAtLocation);
        let estimated = new Date(item.EstimatedTimeAtLocation);

        const diff = Math.abs(estimated - advertised);

        return Math.floor(diff / (1000 * 60)) + " minuter";
    }
</script>

<div on:click={renderTicketView} on:keypress={renderTicketView} role="button" tabindex="0">
    <div class="train-number">
        {data.OperationalTrainNumber}
    </div>

    <div class="current-station">
        <div>{data.LocationSignature}</div>
        <div>{data.FromLocation ? data.FromLocation[0].LocationName + " -> " : ""} {data.ToLocation ? data.ToLocation[0].LocationName : ""}</div>
    </div>

    <div class="delay">
        {outputDelay(data)}
    </div>
</div>

<style>
    .train-number {
        font-size: 2rem;
        font-weight: bold;
        width: 30%;
    }

    .current-station {
        width: 30%;
    }
</style>