function renderMainView() {
    let container = document.getElementById("container");

    // Remove existing children from container before recreating them
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    container.innerHTML = `
    <div class="delayed">
        <h1>Försenade tåg</h1>

        <div id="delayed-trains" class="delayed-trains"></div>
    </div>

    <div id="map" class="map"></div>`;

    const socket = io("http://localhost:1337");

    const map = L.map('map').setView([62.173276, 14.942265], 5);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    let markers = {};

    // Update markers with new data when received from event source (trains model)
    socket.on("message", (data) => {
        if (markers.hasOwnProperty(data.trainnumber)) {
            let marker = markers[data.trainnumber]

            marker.setLatLng(data.position);
        } else {
            let marker = L.marker(data.position).bindPopup(data.trainnumber).addTo(map);

            markers[data.trainnumber] = marker
        }
    });

    let delayed = document.getElementById("delayed-trains");

    // GET delayed data from /delayed route and render it
    fetch("http://localhost:1337/delayed")
        .then((response) => response.json())
        .then(function(result) {
            return renderDelayedTable(result.data, delayed);
        });
}

// Create table of delay items from delayed data (delayed model)
function renderDelayedTable(data, table) {
    data.forEach((item) => {
        // 1 row/div per data item
        let element = document.createElement("div");

        element.innerHTML = `
            <div class="train-number">
                ${item.OperationalTrainNumber}
            </div>
            <div class="current-station">
                <div>${item.LocationSignature}</div>
                <div>${item.FromLocation ? item.FromLocation[0].LocationName + " -> " : ""} ${item.ToLocation ? item.ToLocation[0].LocationName : ""}</div>
            </div>
            <div class="delay">
                ${outputDelay(item)}
            </div>`;

        element.addEventListener("click", function() {
            renderTicketView(item);
        });

        // Append created element to table
        table.appendChild(element);
    });
}

// Calculate delay in minutes
function outputDelay(item) {
    let advertised = new Date(item.AdvertisedTimeAtLocation);
    let estimated = new Date(item.EstimatedTimeAtLocation);

    const diff = Math.abs(estimated - advertised);

    return Math.floor(diff / (1000 * 60)) + " minuter";
}

// Create a ticket view for clicked delay item
function renderTicketView(item) {
    let container = document.getElementById("container");
    let newTicketId = 0;

    // Remove existing children from container before recreating them
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    // Create locationString from item data
    var locationString = "";
    if (item.FromLocation) {
         locationString = `<h3>Tåg från ${item.FromLocation[0].LocationName} till ${item.ToLocation[0].LocationName}. Just nu i ${item.LocationSignature}.</h3>`;
    }

    container.innerHTML = `<div class="ticket-container">
            <div class="ticket">
                <a href="" id="back"><- Tillbaka</a>
                <h1>Nytt ärende #<span id="new-ticket-id"></span></h1>
                ${locationString}
                <p><strong>Försenad:</strong> ${outputDelay(item)}</p>
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
        </div>`;


    let backButton = document.getElementById("back");
    let reasonCodeSelect = document.getElementById("reason-code");
    let newTicketForm = document.getElementById("new-ticket-form");
    let oldTickets = document.getElementById("old-tickets");

    // Set event listener for back button (renderMainView)
    backButton.addEventListener("click", function(event) {
        event.preventDefault();

        renderMainView();
    });

    // Set event listener for new ticket form
    newTicketForm.addEventListener("submit", function(event) {
        event.preventDefault();

        // Create new ticket from code selected by user and current item data
        var newTicket = {
            code: reasonCodeSelect.value,
            trainnumber: item.OperationalTrainNumber,
            traindate: item.EstimatedTimeAtLocation.substring(0, 10),
        };

        // POST new ticket to /tickets route (inserts new ticket into db)
        fetch("http://localhost:1337/tickets", {
            body: JSON.stringify(newTicket),
            headers: {
              'content-type': 'application/json'
            },
            method: 'POST'
        })
            .then((response) => response.json())
            .then((result) => {
                // Re-render ticket view to include newly created ticket
                renderTicketView(item);
            });
    });

    // GET existing tickets from /tickets route
    // Render all tickets in db under "Befintliga ärenden"
    fetch("http://localhost:1337/tickets")
        .then((response) => response.json())
        .then((result) => {
            var lastId = result.data[1] ? result.data[1].id : 0;

            // Set correct newTicketId
            newTicketId = lastId + 1;

            let newTicketIdSpan = document.getElementById("new-ticket-id");

            newTicketIdSpan.textContent = newTicketId;

            result.data.forEach((ticket) => {
                let element = document.createElement("div");

                element.innerHTML = `${ticket.id} - ${ticket.code} - ${ticket.trainnumber} - ${ticket.traindate}`;

                oldTickets.appendChild(element);
            });
        });


    // GET reason codes from /codes route -> codes model
    // Populate reasonCodeSelect with result
    fetch("http://localhost:1337/codes")
        .then((response) => response.json())
        .then((result) => {
            result.data.forEach((code) => {
                let element = document.createElement("option");

                element.textContent = `${code.Code} - ${code.Level3Description}`;
                element.value = code.Code;

                reasonCodeSelect.appendChild(element);
            });
        });
}

// Run on start?
renderMainView();
