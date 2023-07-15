<script>
	import { pb } from '../../lib/pocketbase';

	let user_code = '';

	function get_code() {
		let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let code = '';
		for (let i = 0; i < 5; i++) {
			code += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return code;
	}

	async function create_user() {
		let code = get_code();

		try {
			const user = {
				username: code,
				password: 'default_password',
				passwordConfirm: 'default_password'
			};
			await pb.collection('users').create(user);

			user_code = code;
		} catch (err) {
			user_code = err;
		}
	}
</script>

<div class="grid h-screen place-items-center">
	<h1 class="text-9xl">{user_code}</h1>
	<button class="btn variant-filled" type="button" on:click={create_user}>Create User</button>
</div>
