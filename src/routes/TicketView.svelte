<script>
    export let data;

    import { outputDelay, ROUTES, getData, postData, renderMainView, renderTicketView } from "./utils";

    const reasonCodes = getData(ROUTES.CODES);
    const existingTickets = getData(ROUTES.TICKETS);

    // Create a new ticket and add it to db by posting to /tickets route
    async function createNewTicket() {
        const reasonCodeSelect = document.getElementById("reason-code");

        const newTicket = {
            code: reasonCodeSelect.value,
            trainnumber: data.OperationalTrainNumber,
            traindate: data.EstimatedTimeAtLocation.substring(0, 10),
        };

        await postData(ROUTES.TICKETS, newTicket);

        renderTicketView(data);
    }
</script>

<div class="ticket-container">
    <!-- Back Button -->
    <button on:click={renderMainView}>&larr; Tillbaka</button>

    <h1>Nytt ärende</h1>

    <!-- Train Info -->
    <div class="train-info">
        <h3>
            Tåg {data.OperationalTrainNumber}.

            {#if data.FromLocation}
                Från {data.FromLocation[0].LocationName}
                till {data.ToLocation[0].LocationName}.
            {/if}

            Just nu i {data.LocationSignature}.
        </h3>
        
        <p>Försenad: {outputDelay(data)}</p>
    </div>

    <!-- New Ticket -->
    <div class="new-ticket">
        <form on:submit|preventDefault={createNewTicket}>
            <label for="reason-code">Orsakskod:</label>

            <select id="reason-code">
                {#await reasonCodes}
                    <p>Fetching data...</p>
                {:then reasonCodes}
                    {#each reasonCodes as reasonCode}
                        <option value={reasonCode.Code}>{reasonCode.Code} - {reasonCode.Level3Description}</option>
                    {/each}
                {/await}
            </select>
            
            <input type="submit" value="Skapa nytt ärende" />
        </form>
    </div>

    <!-- Existing Tickets -->
    <div class="existing-tickets">
        <h2>Befintliga ärenden</h2>

        {#await existingTickets}
            <p>Fetching data...</p>
        {:then existingTickets}
            {#each existingTickets as existingTicket}
                <p> 
                    {existingTicket._id} - 
                    {existingTicket.code} - 
                    {existingTicket.trainnumber} - 
                    {existingTicket.traindate}
                </p>
            {/each}
        {/await}
    </div>
</div>

<style>
    .ticket-container {
        padding: 2rem;
    }

    .ticket-container > * {
        margin-bottom: 1.4rem;
    }

    button {
        padding: 0.35rem;
    }

    form {
        display: flex;
        flex-direction: column;
    }

    select {
        width: 50%;
        margin: 0.35rem 0 0.7rem;
        padding: 0.35rem;
    }

    input {
        background-color: rgb(233, 165, 165);
        width: 50%;
        padding: 0.35rem;
    }

    .existing-tickets h2, p {
        margin-bottom: 0.35rem;
    }
</style>