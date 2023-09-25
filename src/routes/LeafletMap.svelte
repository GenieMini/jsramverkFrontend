<script>    
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import { socket } from './utils';

    const markers = {};

    let mapElement;
    let map;

    onMount(async () => {
        if(browser) {
            // Set up map
            const leaflet = await import('leaflet');

            map = leaflet.map(mapElement).setView([62.173276, 14.942265], 5);

            leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

            // Listen for changes in train positions
            socket.on("message", (data) => {
                if (markers.hasOwnProperty(data.trainnumber)) {
                    let marker = markers[data.trainnumber]

                    marker.setLatLng(data.position);
                } else {
                    let marker = L.marker(data.position).bindPopup(data.trainnumber).addTo(map);

                    markers[data.trainnumber] = marker
                }
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