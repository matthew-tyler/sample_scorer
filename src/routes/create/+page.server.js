function get_code() {
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}


function get_category_list(number_of_users) {
    let list = [];
    for (let i = number_of_users; i < (number_of_users + 8); i++) {
        list.push(((i - 1) % 8) + 1);
    }
    return list;
}


export const actions = {

    new_user: async ({ locals, request }) => {

        let code = get_code();
        let number_of_users = 0;

        try {
            const record = await locals.pb.collection("user_count").getList(1, 1)
            number_of_users = parseInt(record.items[0].total);
        } catch (err) {
            console.log(err);
        }

        let category_list = get_category_list(number_of_users);

        try {

            const records = await locals.pb.collection('image_lists').getFullList({
                sort: 'category',
                fields: 'id,category'
            });

            const categories = records.map((record) => [record.category, record.id])
            let id_list = category_list.map(number => categories.find(([cat]) => cat === number)[1])


            const user = {
                username: code,
                password: 'default_password',
                passwordConfirm: 'default_password',
                documents: id_list
            };
            await locals.pb.collection('users').create(user);

            return { success: true, message: code };

        } catch (err) {
            return { success: false, message: err };
        }
    }

};
