<script>
	import { pb, current_user } from '../lib/pocketbase';
	import Rate from '../../lib/rate.svelte';
	import { goto } from '$app/navigation';
</script>

<div class="container h-full mx-auto grid place-items-center">
	<Rate />
</div>
