<script>
	import Rate from '$lib/rate.svelte';
	import { pb, current_user } from '$lib/pocketbase';

	const get_algo = async () => {
		const solved = await pb.collection('JudgoStates').getFullList({
			filter: `rater="${$current_user.id}" && completed=true`
		});

		if (solved.length >= 2) {
			return 'merge';
		}
		return 'Judgo';
	};

	let algo = get_algo();
</script>

<div class="container h-full mx-auto grid place-items-center">
	{#await algo then algo}
		<Rate {algo} />
	{/await}
</div>
