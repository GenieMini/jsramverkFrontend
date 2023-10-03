<script>    
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import { socket, delays } from './utils';

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

            // custom marker
            var myIcon = L.icon({
                iconUrl: './marker-icon.png',
                shadowUrl: './marker-shadow.png',
            });

            // Listen for changes in train positions
            socket.on("message", (data) => {

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