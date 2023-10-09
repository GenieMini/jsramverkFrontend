<script>
    export let data;

    import { renderTicketView, outputDelay } from "./utils";
</script>

<div on:click={() => renderTicketView(data)} on:keypress={() => renderTicketView(data)} role="button" tabindex="0">
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

    {#if data.marker}
        <p>{data.marker._latlng}a</p>
    {/if}
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