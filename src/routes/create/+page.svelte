<script>
	import { enhance } from '$app/forms';

	export let form;
	let user_code = '';
	$: user_code = form?.message === undefined ? '' : form?.message;
</script>

<div class="grid h-screen place-items-center">
	<h1 class="text-9xl">{user_code}</h1>
	<form method="POST" action="?/new_user" use:enhance>
		<button class="btn variant-filled">Create User</button>
	</form>
</div>
