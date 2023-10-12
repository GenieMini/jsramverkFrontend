<script>
    export let data;

    import { outputDelay, renderMainView, renderTicketView, ROUTES, getData, sendRequest } from "./utils";

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

        await sendRequest(ROUTES.TICKETS, newTicket, 'POST');

        renderTicketView(data);
    }

    // Update a ticket
    async function updateTicket(id, _code) {

        await sendRequest(ROUTES.TICKETS, {_id: id, code: _code}, 'PUT');

        renderTicketView(data);
    }

    // Delete a ticket
    async function deleteTicket(id) {

        await sendRequest(ROUTES.TICKETS, {_id: id}, 'DELETE');

        renderTicketView(data);
    }

    // Open update tab
    async function openUpdateTicket(id) {

        let elem = document.getElementById(id);
        const oldCode = elem.innerText;
        elem.innerText = '';

        let selector = document.createElement('select');
        selector.style.border = "none";
        selector.style.fontSize = "1em";
        selector.style.outline = "none";
        selector.style.background = "none";

        const codes = await reasonCodes
        let options = "";
        codes.forEach((reasonCode) => {
            if (reasonCode.Code == oldCode) {
                options += `<option value="${reasonCode.Code}" selected>${reasonCode.Code}</option>`;
            } else {
                options += `<option value="${reasonCode.Code}">${reasonCode.Code}</option>`;
            }
            
        })
        selector.innerHTML = options;

        // Listen for change
        selector.addEventListener('change', (event) => {
            console.log(event.target.value);
            updateTicket(id, event.target.value)
        })

        elem.appendChild(selector);
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
        <table>
            <tr>
                <th>id</th>
                <th>kod</th>
                <th>tågnummer</th>
                <th>koddatum</th>
                <th>update</th>
            </tr>
            {#each existingTickets as existingTicket}
            <tr>
                <td>{existingTicket._id}</td>
                <td id="{existingTicket._id}">{existingTicket.code}</td>
                <td>{existingTicket.trainnumber}</td>
                <td>{existingTicket.traindate}</td>
                <td>
                    <button on:click={() => openUpdateTicket(existingTicket._id)}>change</button>
                    <button on:click={() => deleteTicket(existingTicket._id)}>del</button>
                </td>
            </tr>
            {/each}
        </table>
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
        background-color: rgb(215 232 247);
        width: 50%;
        padding: 5px;
        border-radius: 5px;
        font-size: 1em;
        border: 2px solid lightslategray;
    }

    input:hover {
        background-color: rgb(198, 217, 235);
    }

    .existing-tickets h2, p {
        margin-bottom: 0.35rem;
    }

    table {
        border-spacing: 0;
    }

    td, th {
        padding: 5px;
        margin: 0;
        border: solid 1px rgb(218, 218, 218);
    }

    th {
        background-color: rgb(247, 247, 247);
    }
</style>