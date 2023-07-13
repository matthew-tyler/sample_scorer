<script>
	const swap = () => {};
	const equal = () => {};
	const submit = () => {};
	const back = () => {};
	const forward = () => {};
</script>

<div class="flex flex-col md:flex-row justify-center items-center md:justify-between">
	<div
		class="flex flex-col items-center p-4 rounded-lg bg-green-300 cursor-pointer hover:bg-green-200"
	>
		<h3 class="h3 pb-4">BEST</h3>
		<img src="/1.PNG" alt="Sample 1" class="w-full aspect-auto" />
	</div>

	<div class="flex flex-col justify-center items-center">
		<button class="btn-icon btn-icon-xl variant-filled" on:click={equal}>=</button>
	</div>
	<div class="flex flex-col items-center p-4 rounded-lg bg-red-300 cursor-pointer hover:bg-red-200">
		<h3 class="h3 pb-4">WORST</h3>
		<img src="/2.PNG" alt="Sample 2" class="w-full aspect-auto" />
	</div>
</div>

<nav class="flex justify-around items-center px-4 py-2 shadow-lg w-full">
	<button class="btn" on:click={back}>Back</button>
	<button class="btn" on:click={submit}>Submit</button>
	<button class="btn" on:click={forward}>Forward</button>
</nav>
