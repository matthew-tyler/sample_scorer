<script>
	let user_code = '';

	export let form;
</script>

<div class="grid h-screen place-items-center">
	<h1 class="text-9xl">{form?.success}</h1>
	<form method="POST" action="?/new_user">
		<button class="btn variant-filled">Create User</button>
	</form>
</div>
