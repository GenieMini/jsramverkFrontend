<script>
    export let delays;

    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import { socket } from './utils';
    import { map, followCount } from '$lib/stores/DelayStore';

    let mapElement;
    let layerGroup;
    let myIcon;

    $: $followCount, drawExistingMarkers();

    /**
     * Look for markers in delay objects.
     * Add all found markers to map.
     * If followCount > 0, only add followed trains.
     * Else add all trains with marker property.
     */
    function drawExistingMarkers() {
        if (!layerGroup) {
            return;
        }

        layerGroup.clearLayers();

        $delays.forEach((delay) => {
                if ($followCount > 0) {
                    if (delay.follow) {
                        const marker = L.marker(delay.marker._latlng, {icon: myIcon})
                        .bindPopup(delay.OperationalTrainNumber)
                        .addTo(layerGroup);

                        delay.marker = marker;
                    }
                } else if (delay.marker) {
                    const marker = L.marker(delay.marker._latlng, {icon: myIcon})
                        .bindPopup(delay.OperationalTrainNumber)
                        .addTo(layerGroup);
                    
                    delay.marker = marker;
                }
        });
    }

    /**
     * Called when a new message is received from socket.
     * Message includes data which is a train object with location.
     * Match the train object with delay objects.
     * Update marker if it exists or create new marker if it doesn't.
     * @param data
     */
    function updateOrCreateTrainMarker(data) {
        const foundDelay = $delays.find(delay => delay.OperationalTrainNumber === data.trainnumber);

        if (foundDelay) {
            if (foundDelay.marker) {
                foundDelay.marker.setLatLng(data.position);
            } else {
                const marker = L.marker(data.position, {icon: myIcon})
                        .bindPopup(data.trainnumber);

                foundDelay.marker = marker;

                if ($followCount === 0 || foundDelay.follow) {
                    marker.addTo(layerGroup);
                }
            }
            
            $delays = $delays;
        }
    }

    onMount(async () => {
        if(browser) {
            // Set up map
            const L = await import('leaflet');

            $map = L.map(mapElement).setView([62.173276, 14.942265], 5);

            // Add tile layer to map
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo($map);

            // custom marker
            myIcon = L.icon({
                iconUrl: './marker-icon.png',
                shadowUrl: './marker-shadow.png',
                iconAnchor:   [12, 40],
                popupAnchor:  [0, -40]
            });

            layerGroup = L.layerGroup().addTo($map);

            drawExistingMarkers();

            // Listen for changes in train positions
            socket.on("message", (data) => {
                updateOrCreateTrainMarker(data);
        });
        }
    });

    onDestroy(async () => {
        if($map) {
            $map.remove();
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