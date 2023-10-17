import { redirect } from '@sveltejs/kit';
import { pb } from '../../lib/pocketbase';

export function load() {
    if (!pb.authStore.isValid) {
        throw redirect(307, '/');
    } else if (!pb.authStore.model.completed_tutorial) {
        throw redirect(307, "/tutorial")
    }
}


