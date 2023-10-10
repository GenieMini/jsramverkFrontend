<script>
    export let delays;

    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import { socket } from './utils';
    import { map } from '$lib/stores/DelayStore';

    let mapElement;
    // let map;

    onMount(async () => {
        if(browser) {
            // Set up map
            const leaflet = await import('leaflet');

            $map = leaflet.map(mapElement).setView([62.173276, 14.942265], 5);

            // Add tile layer to map
            leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo($map);

            // custom marker
            var myIcon = L.icon({
                iconUrl: './marker-icon.png',
                shadowUrl: './marker-shadow.png',
            });

            // Re-add existing markers after using back button in TicketView
            $delays.forEach((delay) => {
                if (delay.hasOwnProperty("marker")) {
                    const marker = L.marker(delay.marker._latlng, {icon: myIcon})
                        .bindPopup(delay.OperationalTrainNumber)
                        .addTo($map);

                    delay.marker = marker;
                }
            });

            // Listen for changes in train positions
            socket.on("message", (data) => {

                const foundDelay = $delays.find(delay => delay.OperationalTrainNumber === data.trainnumber);
                
                // Add or update marker property of delay object if delay found
                if (foundDelay) {
                    if (foundDelay.hasOwnProperty("marker")) {
                        foundDelay.marker.setLatLng(data.position);
                    } else {
                        const marker = L.marker(data.position, {icon: myIcon})
                                .bindPopup(data.trainnumber)
                                .addTo($map);

                        foundDelay.marker = marker;
                    }

                    $delays = $delays;
                }

                /*
                // Do if emitted train number is in delayed array
                if (delays.find(delay => delay.OperationalTrainNumber === data.trainnumber)) {

                    if (markers.hasOwnProperty(data.trainnumber)) {
                        let marker = markers[data.trainnumber]

                        marker.setLatLng(data.position);
                    } else {
                        let marker = L.marker(data.position, {icon: myIcon})
                            .bindPopup(data.trainnumber)
                            .addTo(map);

                        markers[data.trainnumber] = marker
                    }

                    console.log(Object.keys(markers).length + " train markers.");
                }
                */
        });
        }
    });

    onDestroy(async () => {
        if(map) {
            map.remove();
        }
    });
</script>

<main>
    <div bind:this={mapElement}></div>
</main>

<style>
    @import 'leaflet/dist/leaflet.css';

    main div {
        height: 100vh;
        width: 60vw;
    }
</style>