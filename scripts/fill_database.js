import PocketBase from 'pocketbase'
import { readFileSync } from 'fs';
import fs from 'fs';



const pb = new PocketBase("http://127.0.0.1:8090")


// Replace random to include seed
function shuffle_array(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


async function insert() {

    const file = readFileSync("Vertical_Small_Right_imgs.json");
    const image_ids = JSON.parse(file);

    // add shuffle when sussed
    let array = shuffle_array(image_ids)

    const data = {
        "Title": "Vertical_Small_Right",
        "image_ids": array
    };

    await pb.collection('image_lists').create(data)
}



insert()