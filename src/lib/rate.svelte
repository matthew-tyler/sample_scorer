<script>
	import { pb, image_pairs } from '$lib/pocketbase';

	const IMG1 = 0;
	const IMG2 = 1;

	let position = 0;
	let score = null;

	$: image1 = $image_pairs[position][0];
	$: image2 = $image_pairs[position][1];

	const equal = () => {
		score = 'similar';
	};

	const submit = () => {
		if (score === null) {
			return;
		}
		score = null;
		forward();
	};
	const back = () => {
		position = Math.max(position - 1, 0);
	};
	const forward = () => {
		position = Math.min(position + 1, $image_pairs.length - 1);
	};

	const key_press = (e) => {
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
				submit();
		}
	};
</script>

<div class="grid grid-cols-1 md:grid-cols-7 gap-6 items-center justify-items-center">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="flex flex-col items-center p-4 rounded-lg cursor-pointer w-full h-64 md:h-auto md:col-span-3
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
		<img src="/{image1}.png" alt="Sample 1" class="object-contain h-3/4 md:h-auto" />
	</div>

	<div class="flex flex-col justify-center items-center p-4 md:col-span-1">
		<button on:click={equal} class="btn-icon btn-icon-xl variant-filled">=</button>
	</div>

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="flex flex-col items-center p-4 rounded-lg cursor-pointer w-full h-64 md:h-auto md:col-span-3
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
		<img src="/{image2}.png" alt="Sample 2" class="object-contain h-3/4 md:h-auto" />
	</div>
</div>

<nav class="flex justify-around items-center px-4 py-2 shadow-lg w-full">
	<button class="btn" on:click={back}>Back</button>
	<button class="btn" on:click={submit}>Submit</button>
	<button class="btn" on:click={forward}>Forward</button>
</nav>

<svelte:window on:keydown={key_press} />
