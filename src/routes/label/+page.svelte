<script>
	import { pb, current_user } from '$lib/pocketbase';
	import Rate from '$lib/rate.svelte';

	async function update_pairs() {}
</script>

<div class="container h-full mx-auto grid place-items-center">
	{#await update_pairs() then val}
		<Rate />
	{:catch error}
		<p style="color: red">{error}</p>
	{/await}
</div>
