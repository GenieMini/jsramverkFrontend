import DelayedTable from "./DelayedTable.svelte";
import LeafletMap from "./LeafletMap.svelte";
import TicketView from "./TicketView.svelte";

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