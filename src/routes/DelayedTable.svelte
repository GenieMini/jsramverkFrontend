<script>
    export let delays;

    import { onMount, onDestroy } from 'svelte';
    import { socket, openedByClient } from './utils';
    import DelayedItem from './DelayedItem.svelte';

    let save = false;

    onMount(() => {
        // Receive updates
        socket.on('ticket open', function (_openedTickets) {
            ticketHelper.openedTickets = _openedTickets;

            // Remove previous tickets opened by client when view is created/refreshed
            if (openedByClient.length > 0 && save === false) {
                ticketHelper.removeClientOpens();
                openedByClient.length = 0;
            }
        });

        // Emit empty string to init openedTickets
        socket.emit('ticket open', "");
    });

    const ticketHelper = {
        openedTickets: [],

        addClientOpen(otn) {
            save = true;

            ticketHelper.openedTickets.push(otn);
            openedByClient.push(otn);

            socket.emit('ticket open', ticketHelper.openedTickets);
        },

        removeClientOpens() {
            openedByClient.forEach((otn) => {
                ticketHelper.openedTickets.splice(ticketHelper.openedTickets.indexOf(otn), 1);
            });

            socket.emit('ticket open', ticketHelper.openedTickets);
        }
    };

    onDestroy(() => {
        ticketHelper.removeClientOpens();
    });
</script>

<div class="delayed">
    <h1>Försenade tåg</h1>

    <div id="delayed-trains" class="delayed-trains">
        {#each $delays as delay}
	        <DelayedItem data={delay} ticketHelper={ticketHelper}/>
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