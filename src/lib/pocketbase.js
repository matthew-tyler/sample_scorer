import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import PocketBase from 'pocketbase'
import { writable } from 'svelte/store'
import { localStorageStore } from '@skeletonlabs/skeleton';


export const pb = new PocketBase(PUBLIC_POCKETBASE_URL)
export const current_user = localStorageStore('usr', pb.authStore.model)
