<script>
    export let data;
    export let ticketHelper;

    import { followCount } from "$lib/stores/DelayStore";
    import { outputDelay, renderTicketView } from "./utils";

    import Fa from 'svelte-fa';
    import { faTicket, faArrowsToEye } from '@fortawesome/free-solid-svg-icons';

    function toggleFollow() {
        if (data.hasOwnProperty("follow")) {
            if (data.follow === true) {
                data.follow = false;
                $followCount--;
            } else {
                data.follow = true;
                $followCount++;
            }
        } else {
            data.follow = true;
            $followCount++;
        }
    }

    function openTicket(data) {
        ticketHelper.addClientOpen(data.OperationalTrainNumber);
        
        renderTicketView(data);
    }
</script>

<div class="train-container">
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

    <div class="buttons">
        <!-- Disable ticket button if ticket is already open -->
        {#if !ticketHelper.openedTickets.includes(data.OperationalTrainNumber)}
            <button class="button" on:click={() => openTicket(data)}>
                <Fa icon={faTicket} size="1.5x" color="red"/>
            </button>
        {:else}
            <button class="button" disabled>
                <Fa icon={faTicket} size="1.5x"/>
            </button>
        {/if}

        {#if data.marker}
            <button class="button" on:click={toggleFollow}>
                {#if data.follow}
                    <Fa icon={faArrowsToEye} size="1.5x" color="green"/>
                {:else}
                    <Fa icon={faArrowsToEye} size="1.5x" color="blue"/>
                {/if}
            </button>
        {:else}
            <button class="button" disabled>
                <Fa icon={faArrowsToEye} size="1.5x"/>
            </button>
        {/if}
    </div>
</div>

<style>
    .train-container {
        border-top: 1px solid #ccc;
        padding: 0.25rem;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
    }

    .train-container > div {
        flex: 2;
    }

    .train-number {
        font-size: 2rem;
        font-weight: bold;
        width: 30%;
    }

    .current-station {
        width: 30%;
    }

    .buttons {
        flex: 1;
    }

    .button {
        padding: 0.25rem;
    }
</style>