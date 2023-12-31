import { DEV } from "esm-env";
import { io } from "socket.io-client";
import DelayedTable from "./DelayedTable.svelte";
import LeafletMap from "./LeafletMap.svelte";
import TicketView from "./TicketView.svelte";
import LoginPage from "./LoginPage.svelte";
import RegisterPage from "./CreateAccount.svelte";
import { delays } from "$lib/stores/DelayStore";

const BACKEND_URL = DEV
    ? "http://localhost:1337"
    : "http://jsramverk-editor-shou21.azurewebsites.net";

export const socket = io(BACKEND_URL);

export const ROUTES = {
    DELAYS: "delayed",
    CODES: "codes",
    TICKETS: "tickets",
    REGISTER: "auth/register",
    LOGIN: "auth/login",
};

export let openedByClient = [];

function clearContainer() {
    const container = document.getElementById("container");

    // Remove existing children from container
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    return container;
}

export async function renderMainView() {
    const container = clearContainer();

    new DelayedTable({
        target: container,
        props: {delays: delays}
    });

    new LeafletMap({
        target: container,
        props: {delays: delays}
    });
}

export function renderTicketView(data) {
    const container = clearContainer();

    new TicketView({
        target: container,
        props: {data: data}
    });
}

export function renderLoginView() {
    const container = clearContainer();

    new LoginPage({
        target: container
    });
}

export function renderRegisterView() {
    const container = clearContainer();

    new RegisterPage({
        target: container
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
export async function getData(route, _token = '') {
    try {
        const result = await fetch(`${BACKEND_URL}/${route}`, {
            headers: {
                'x-access-token': _token
            }
        });
        const res = await result.json();

        return res.data;
    } catch(e) {
        console.log(e);
    }
}

export async function sendRequest(route, data, _method, _token = '') {
    try {
        return await fetch(`${BACKEND_URL}/${route}`, {
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json',
                'x-access-token': _token
            },
            method: _method
        });
    } catch(e) {
        console.log(e);
        return null
    }
}
