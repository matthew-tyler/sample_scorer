



function category_lists() {

    let number_of_accounts = 10;

    for (let i = number_of_accounts; i < (number_of_accounts + 8); i++) {
        console.log(((i - 1) % 8) + 1);
    }
}


category_lists();