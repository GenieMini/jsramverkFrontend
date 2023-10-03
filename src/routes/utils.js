import { DEV } from "esm-env";
import { io } from "socket.io-client";
import DelayedTable from "./DelayedTable.svelte";
import LeafletMap from "./LeafletMap.svelte";
import TicketView from "./TicketView.svelte";

const BACKEND_URL = DEV
    ? "http://localhost:1337"
    : "http://jsramverk-editor-shou21.azurewebsites.net";

export const socket = io(BACKEND_URL);

export const ROUTES = {
    DELAYS: "delayed",
    CODES: "codes",
    TICKETS: "tickets"
};

export const delays = await getData(ROUTES.DELAYS);
console.log(delays.length + " delayed trains.");

export function renderMainView() {
    let container = document.getElementById("container");

    // Remove existing children from container
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    // Append new components to container
    new DelayedTable({
        target: container
    });

    new LeafletMap({
        target: container
    });
}

export function renderTicketView(data) {
    let container = document.getElementById("container");

    // Remove existing children from container before recreating them
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    new TicketView({
        target: container,
        props: {data: data}
    });
}

// Calculate delay in minutes
export function outputDelay(data) {
    let advertised = new Date(data.AdvertisedTimeAtLocation);
    let estimated = new Date(data.EstimatedTimeAtLocation);

    const diff = Math.abs(estimated - advertised);
    const mins = Math.floor(diff / (1000 * 60));

    let minDisplay = " minuter";

    if (mins === 1) {
        minDisplay = " minut";
    }

    return mins + minDisplay;
}

// Get data from route
export async function getData(route) {
    try {
        const result = await fetch(`${BACKEND_URL}/${route}`);
        const res = await result.json();

        return res.data;
    } catch(e) {
        console.log(e);
    }
}

// Post data to route
export async function postData(route, data) {
    try {
        await fetch(`${BACKEND_URL}/${route}`, {
            body: JSON.stringify(data),
            headers: {
            'content-type': 'application/json'
            },
            method: 'POST'
        });
    } catch(e) {
        console.log(e);
    }
}