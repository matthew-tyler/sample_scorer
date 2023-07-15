<script>
	const swap = () => {};
	const equal = () => {};
	const submit = () => {};
	const back = () => {};
	const forward = () => {};
</script>

<div class="grid grid-cols-1 md:grid-cols-7 gap-6 items-center justify-items-center">
  <div class="flex flex-col items-center p-4 rounded-lg bg-green-300 cursor-pointer hover:bg-green-200 w-full h-64 md:h-auto md:col-span-3  ">
      <h3 class="pb-4">BEST</h3>
      <img src="/1.png" alt="Sample 1" class="object-contain h-3/4 md:h-auto">
  </div>

  <div class="flex flex-col justify-center items-center p-4 md:col-span-1">
      <button class="btn-icon btn-icon-xl variant-filled">=</button>
  </div>

  <div class="flex flex-col items-center p-4 rounded-lg bg-red-300 cursor-pointer hover:bg-red-200 w-full h-64 md:h-auto md:col-span-3 ">
      <h3 class="pb-4">WORST</h3>
      <img src="/2.png" alt="Sample 2" class="object-contain h-3/4 md:h-auto">
  </div>
</div>



<nav class="flex justify-around items-center px-4 py-2 shadow-lg w-full">
	<button class="btn" on:click={back}>Back</button>
	<button class="btn" on:click={submit}>Submit</button>
	<button class="btn" on:click={forward}>Forward</button>
</nav>
