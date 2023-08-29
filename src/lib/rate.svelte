<script>
	import { pb, current_user } from '$lib/pocketbase';
	import { Judgo, PBWrapper } from '$lib/judgo.js';
	import { onMount } from 'svelte';

	let comparison_algorithm;
	onMount(async () => {
		const dao = await PBWrapper.create(pb, $current_user.id, $current_user.documents);
		comparison_algorithm = await Judgo.fromDatabase(dao);
	});

	const IMG1 = 0;
	const IMG2 = 1;
	let score = null;

	let image1 = '';
	let image2 = '';

	let round_number = 0;

	$: if (comparison_algorithm) {
		image1 = comparison_algorithm.root.equivalenceClass[0];
		image2 = comparison_algorithm.next_node.equivalenceClass[0];
		round_number = comparison_algorithm.round_number();
	}

	const equal = () => {
		score = 'similar';
	};

	const submit = async () => {
		if (score === null) {
			return;
		}
		switch (score) {
			case IMG1:
				await comparison_algorithm.greater_than();
				break;
			case 'similar':
				await comparison_algorithm.equal();
				break;
			case IMG2:
				await comparison_algorithm.less_than();
				break;
		}

		image1 = comparison_algorithm.root.equivalenceClass[0];
		image2 = comparison_algorithm.next_node.equivalenceClass[0];
		score = null;
	};

	const key_press = async (e) => {
		switch (e.key) {
			case 'ArrowLeft':
				score = IMG1;
				break;
			case 'ArrowRight':
				score = IMG2;
				break;
			case 'ArrowUp':
				score = 'similar';
				break;
			case 'Enter':
				await submit();
		}
	};
</script>

<h2 class="absolute">Round {round_number}</h2>

<div class="grid grid-cols-1 md:grid-cols-7 gap-6 items-center justify-items-center">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="flex flex-col items-center p-4 rounded-lg cursor-pointer w-full h-64 md:col-span-3
		{score === IMG1
			? 'bg-green-300 hover:bg-green-200'
			: score === IMG2
			? 'bg-red-300 hover:bg-red-200'
			: score === 'similar'
			? 'bg-blue-300 hover:bg-blue-200'
			: 'bg-gray-300 hover:bg-gray-200'}"
		on:click={() => {
			score = IMG1;
		}}
	>
		<h3 class="pb-4">
			{score === IMG1
				? 'Best'
				: score === IMG2
				? 'Worst'
				: score === 'similar'
				? 'Similar'
				: 'Unrated'}
		</h3>
		<img src="/{image1}.png" alt="Sample 1" class="object-contain h-3/4 bg-black" />
	</div>

	<div class="flex flex-col justify-center items-center p-4 md:col-span-1">
		<button on:click={equal} class="btn-icon btn-icon-xl variant-filled">=</button>
	</div>

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="flex flex-col items-center p-4 rounded-lg cursor-pointer w-full h-64 md:col-span-3
		{score === IMG2
			? 'bg-green-300 hover:bg-green-200'
			: score === IMG1
			? 'bg-red-300 hover:bg-red-200'
			: score === 'similar'
			? 'bg-blue-300 hover:bg-blue-200'
			: 'bg-gray-300 hover:bg-gray-200'}"
		on:click={() => (score = IMG2)}
	>
		<h3 class="pb-4">
			{score === IMG2
				? 'Best'
				: score === IMG1
				? 'Worst'
				: score === 'similar'
				? 'Similar'
				: 'Unrated'}
		</h3>
		<img src="/{image2}.png" alt="Sample 2" class="object-contain h-3/4 bg-black" />
	</div>
</div>

<nav class="flex justify-around items-center px-4 py-2 w-full">
	<button class="btn variant-filled-surface" on:click={submit}>Submit</button>
</nav>

<svelte:window on:keydown={key_press} />
