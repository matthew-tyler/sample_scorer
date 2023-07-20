import { fail } from '@sveltejs/kit';


function get_code() {
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}


export const actions = {

    new_user: async ({ locals, request }) => {

        let code = get_code();

        try {
            const user = {
                username: code,
                password: 'default_password',
                passwordConfirm: 'default_password'
            };
            await locals.pb.collection('users').create(user);

            return { success: true, message: code };

        } catch (err) {
            return { success: false, message: err };
        }
    }

};
