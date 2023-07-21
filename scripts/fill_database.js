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


// Probably needs to change? 
function generate_pairs(array) {

    let pairs = [];

    for (let i = 1; i < array.length; i++) {
        pairs.push([array[i - 1], array[i]])
    }

    pairs.push([array[0], array[array.length - 1]])
    return pairs;
}





async function insert() {

    const file = readFileSync("image_ids.json");
    const image_ids = JSON.parse(file);

    // add shuffle when sussed
    let array = generate_pairs(image_ids)

    await pb.collection('images').create({ pairs: array })
}



insert()