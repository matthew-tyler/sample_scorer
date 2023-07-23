<script>
	import { pb, current_user, image_pairs } from '$lib/pocketbase';
	import Rate from '$lib/rate.svelte';

	async function update_pairs() {
		if ($image_pairs.length === 0) {
			let record = await pb.collection('images').getOne($current_user.group);
			$image_pairs = record.pairs;
		}
	}
</script>

<div class="container h-full mx-auto grid place-items-center">
	{#await update_pairs() then val}
		<Rate />
	{:catch error}
		<p style="color: red">{error}</p>
	{/await}
</div>
