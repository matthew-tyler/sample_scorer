<script>
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';
	import { AppShell, AppBar, LightSwitch } from '@skeletonlabs/skeleton';

	import { pb, current_user } from '../lib/pocketbase';
	import { goto } from '$app/navigation';

	function logout() {
		pb.authStore.clear();
		goto('/');
	}
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase hidden lg:inline"><a href="/">PairWisely</a></strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<LightSwitch />
				{#if $current_user}
					<p class="text">{$current_user.username}</p>
					<button type="button" class="btn variant-filled" on:click={logout}>Logout</button>
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
