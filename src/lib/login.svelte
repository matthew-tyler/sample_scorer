<script>
	import { pb } from './pocketbase';
	import { goto } from '$app/navigation';

	let user_code = '';

	async function login() {
		try {
			const user = await pb.collection('users').authWithPassword(user_code, 'default_password', {});

			goto('/label');
		} catch (err) {
			console.log(err);
		}
	}
</script>

<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
	<input bind:value={user_code} class="input" type="text" title="input id" placeholder="input ID" />
	<button type="button" class="btn variant-filled" on:click={login}>Login</button>
</div>
