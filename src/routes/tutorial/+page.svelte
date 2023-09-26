<script>
	import { goto } from '$app/navigation';
	import { Stepper, Step } from '@skeletonlabs/skeleton';
	import { scale } from 'svelte/transition';
	import { pb, current_user } from '$lib/pocketbase';

	let round_number = 0;

	$: img1 = 'wise2';
	$: img2 = 'wise5';

	let imgs = ['wise2', 'wise4', 'wise3', 'wise1'];

	setInterval(() => {
		round_number = (round_number % 2) + 1;
		img1 = imgs[round_number - 1];
		img2 = imgs[round_number - 1 + 2];
	}, 1500);

	async function done(event) {
		await pb.collection('users').update($current_user.id, { completed_tutorial: true });
		goto('/label');
	}
</script>

<div class="container h-full mx-auto grid place-items-center">
	<Stepper on:complete={done}>
		<Step>
			<svelte:fragment slot="header">Hello there!</svelte:fragment>
			<pre>
                Welcome to pairwisely! The goal of this site is to categorise handwriting samples. 
                
                It's very simple, you will be presented with two samples and you just need to decide which handwriting is clearest.
                If they're so similar that you can't decide, you can just say they're equal.

                Let's take a look!
            </pre>
		</Step>
		<Step>
			<svelte:fragment slot="header">Two images</svelte:fragment>
			<div class="grid grid-cols-1 md:grid-cols-7 gap-6 items-center justify-items-center">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="flex flex-col items-center p-4 rounded-lg cursor-pointer w-full h-64 md:col-span-3 bg-gray-300 hover:bg-gray-200"
				>
					<h3 class="pb-4">Unrated</h3>
					<img src="/wise3.png" alt="Sample 1" class="object-contain h-3/4 bg-black" />
				</div>

				<div class="flex flex-col justify-center items-center p-4 md:col-span-1">
					<button class="btn-icon btn-icon-xl variant-filled">=</button>
					<h2 class="absolute mr-56 text-center lg:mr-0 lg:mt-56">Round 1</h2>
				</div>

				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="flex flex-col items-center p-4 rounded-lg cursor-pointer w-full h-64 md:col-span-3 bg-gray-300 hover:bg-gray-200"
				>
					<h3 class="pb-4">Unrated</h3>
					<img src="/wise2.png" alt="Sample 2" class="object-contain h-3/4 bg-black" />
				</div>
			</div>
			<nav class="flex justify-around items-center px-4 py-2 w-full">
				<button class="btn variant-filled-surface">Submit</button>
			</nav>

			<pre>
                Images that haven't been rated will have a grey background.




            </pre>
		</Step>

		<Step>
			<svelte:fragment slot="header">Pick the clearest!</svelte:fragment>
			<div class="grid grid-cols-1 md:grid-cols-7 gap-6 items-center justify-items-center">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="flex flex-col items-center p-4 rounded-lg cursor-pointer w-full h-64 md:col-span-3 bg-red-300 hover:bg-red-200"
				>
					<h3 class="pb-4">Worst</h3>
					<img src="/wise3.png" alt="Sample 1" class="object-contain h-3/4 bg-black" />
				</div>

				<div class="flex flex-col justify-center items-center p-4 md:col-span-1">
					<button class="btn-icon btn-icon-xl variant-filled">=</button>
					<h2 class="absolute mr-56 text-center lg:mr-0 lg:mt-56">Round 1</h2>
				</div>

				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="flex flex-col items-center p-4 rounded-lg cursor-pointer w-full h-64 md:col-span-3 bg-green-300 hover:bg-green-200"
				>
					<h3 class="pb-4">Best</h3>
					<img src="/wise2.png" alt="Sample 2" class="object-contain h-3/4 bg-black" />
				</div>
			</div>
			<nav class="flex justify-around items-center px-4 py-2 w-full">
				<button class="btn variant-filled-surface">Submit</button>
			</nav>

			<pre>
                You can choose what you think is clearest by clicking on it. 
                Alternatively you can use the left and right keys to select.

                Whichever one you choose will turn green, the other will turn red. 

            </pre>
		</Step>

		<Step>
			<svelte:fragment slot="header">Too Similar?</svelte:fragment>
			<div class="grid grid-cols-1 md:grid-cols-7 gap-6 items-center justify-items-center">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="flex flex-col items-center p-4 rounded-lg cursor-pointer w-full h-64 md:col-span-3 bg-blue-300 hover:bg-blue-200"
				>
					<h3 class="pb-4">Similar</h3>
					<img src="/wise3.png" alt="Sample 1" class="object-contain h-3/4 bg-black" />
				</div>

				<div class="flex flex-col justify-center items-center p-4 md:col-span-1">
					<button class="btn-icon btn-icon-xl variant-filled">=</button>
					<h2 class="absolute mr-56 text-center lg:mr-0 lg:mt-56">Round 1</h2>
				</div>

				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="flex flex-col items-center p-4 rounded-lg cursor-pointer w-full h-64 md:col-span-3 bg-blue-300 hover:bg-blue-200"
				>
					<h3 class="pb-4">Similar</h3>
					<img src="/wise2.png" alt="Sample 2" class="object-contain h-3/4 bg-black" />
				</div>
			</div>
			<nav class="flex justify-around items-center px-4 py-2 w-full">
				<button class="btn variant-filled-surface">Submit</button>
			</nav>

			<pre>
                If you think they're too similar you can select the = button.
                Or use the up arrow key on the keyboard.

                If you've selected similar they'll turn blue.        

            </pre>
		</Step>

		<Step>
			<svelte:fragment slot="header">Submitting</svelte:fragment>
			<div class="grid grid-cols-1 md:grid-cols-7 gap-6 items-center justify-items-center">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="flex flex-col items-center p-4 rounded-lg cursor-pointer w-full h-64 md:col-span-3 bg-red-300 hover:bg-red-200"
				>
					<h3 class="pb-4">Worst</h3>
					<img src="/wise3.png" alt="Sample 1" class="object-contain h-3/4 bg-black" />
				</div>

				<div class="flex flex-col justify-center items-center p-4 md:col-span-1">
					<button class="btn-icon btn-icon-xl variant-filled">=</button>
					<h2 class="absolute mr-56 text-center lg:mr-0 lg:mt-56">Round 1</h2>
				</div>

				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="flex flex-col items-center p-4 rounded-lg cursor-pointer w-full h-64 md:col-span-3 bg-green-300 hover:bg-green-200"
				>
					<h3 class="pb-4">Best</h3>
					<img src="/wise2.png" alt="Sample 2" class="object-contain h-3/4 bg-black" />
				</div>
			</div>
			<nav class="flex justify-around items-center px-4 py-2 w-full">
				<button class="btn variant-filled-surface">Submit</button>
			</nav>

			<pre>
                Once you've finalised your decision you can use the submit button.
                Or use the up enter key on the keyboard.

                       

            </pre>
		</Step>

		<Step>
			<svelte:fragment slot="header">Submitting</svelte:fragment>
			<div class="grid grid-cols-1 md:grid-cols-7 gap-6 items-center justify-items-center">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="flex flex-col items-center p-4 rounded-lg cursor-pointer w-full h-64 md:col-span-3 bg-gray-300 hover:bg-gray-200"
				>
					<h3 class="pb-4">Unrated</h3>
					<img src="/wise2.png" alt="Sample 1" class="object-contain h-3/4 bg-black" />
				</div>

				<div class="flex flex-col justify-center items-center p-4 md:col-span-1">
					<button class="btn-icon btn-icon-xl variant-filled">=</button>
					<h2 class="absolute mr-56 text-center lg:mr-0 lg:mt-56">Round 1</h2>
				</div>

				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="flex flex-col items-center p-4 rounded-lg cursor-pointer w-full h-64 md:col-span-3 bg-gray-300 hover:bg-gray-200"
				>
					<h3 class="pb-4">Unrated</h3>
					<img src="/wise5.png" alt="Sample 2" class="object-contain h-3/4 bg-black" />
				</div>
			</div>
			<nav class="flex justify-around items-center px-4 py-2 w-full">
				<button class="btn variant-filled-surface">Submit</button>
			</nav>

			<pre>
                The "Best" as chosen by you will be placed on the left. 
                A new image will appear on the right. 


                       
            </pre>
		</Step>

		<Step>
			<svelte:fragment slot="header">New Round</svelte:fragment>
			<div class="grid grid-cols-1 md:grid-cols-7 gap-6 items-center justify-items-center">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="flex flex-col items-center p-4 rounded-lg cursor-pointer w-full h-64 md:col-span-3 bg-gray-300 hover:bg-gray-200"
				>
					<h3 class="pb-4">Unrated</h3>
					<img src="/{img1}.png" alt="Sample 1" class="object-contain h-3/4 bg-black" />
				</div>

				<div class="flex flex-col justify-center items-center p-4 md:col-span-1">
					<button class="btn-icon btn-icon-xl variant-filled">=</button>
					{#key round_number}
						<h2
							class="absolute mr-56 text-center lg:mr-0 lg:mt-56"
							transition:scale|local={{ start: 5, duration: 400 }}
						>
							Round {round_number}
						</h2>
					{/key}
				</div>

				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="flex flex-col items-center p-4 rounded-lg cursor-pointer w-full h-64 md:col-span-3 bg-gray-300 hover:bg-gray-200"
				>
					<h3 class="pb-4">Unrated</h3>
					<img src="/{img2}.png" alt="Sample 2" class="object-contain h-3/4 bg-black" />
				</div>
			</div>
			<nav class="flex justify-around items-center px-4 py-2 w-full">
				<button class="btn variant-filled-surface">Submit</button>
			</nav>

			<pre>
                When you reach a new round, the round number will flash and increment.  
                The images on both the left and the right will change.

                Sometimes the rounds will start again, this is when you've reached another category.
				There are 8 categories, but the number of rounds is determined by your choices.
            </pre>
		</Step>

		<Step>
			<svelte:fragment slot="header">Game Over Man</svelte:fragment>
			<div class="grid grid-cols-1 md:grid-cols-7 gap-6 items-center justify-items-center">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="flex flex-col items-center p-4 rounded-lg cursor-pointer w-full h-64 md:col-span-3 bg-gray-300 hover:bg-gray-200"
				>
					<h3 class="pb-4">Unrated</h3>
					<img src="/game.png" alt="Sample 1" class="object-contain h-3/4 bg-black" />
				</div>

				<div class="flex flex-col justify-center items-center p-4 md:col-span-1">
					<button class="btn-icon btn-icon-xl variant-filled">=</button>
					<h2 class="absolute mr-56 text-center lg:mr-0 lg:mt-56">Round 1</h2>
				</div>

				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="flex flex-col items-center p-4 rounded-lg cursor-pointer w-full h-64 md:col-span-3 bg-gray-300 hover:bg-gray-200"
				>
					<h3 class="pb-4">Unrated</h3>
					<img src="/over.png" alt="Sample 2" class="object-contain h-3/4 bg-black" />
				</div>
			</div>
			<nav class="flex justify-around items-center px-4 py-2 w-full">
				<button class="btn variant-filled-surface">Submit</button>
			</nav>

			<pre>
                When you've finished all of the images, it'll say Game Over.  
                And that's all there is to it!

                

            </pre>
		</Step>
	</Stepper>
</div>
