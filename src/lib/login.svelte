<script>
	import { pb } from './pocketbase';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';

	let user_code = '';
	let error = '';

	async function login() {
		try {
			const user = await pb.collection('users').authWithPassword(user_code, 'default_password', {});

			goto('/label');
		} catch (err) {
			error = err.message;
			setTimeout(() => (error = ''), 2000);
		}
	}
</script>

<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
	<input bind:value={user_code} class="input" type="text" title="input id" placeholder="input ID" />
	<button type="button" class="btn variant-filled" on:click={login}>Login</button>
</div>

{#if error}
	<div class="fixed inset-x-0 bottom-1/4 flex justify-center items-center">
		<aside class="alert variant-ghost-error" transition:fade|local={{ duration: 200 }}>
			<!-- Message -->
			<div class="alert-message">
				<p>{error}</p>
			</div>
		</aside>
	</div>
{/if}
