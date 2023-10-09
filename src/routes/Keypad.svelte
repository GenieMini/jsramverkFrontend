<script>
	import { createEventDispatcher } from 'svelte';

	export let value = '';
</script>

<div class="keypad">
    {#if value.marker}
        <p>{value.marker._latlng}aa</p>
    {/if}
</div>