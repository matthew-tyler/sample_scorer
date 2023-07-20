import PocketBase from 'pocketbase'
import { readFileSync } from 'fs';
import fs from 'fs';



const pb = new PocketBase("http://127.0.0.1:8090")



function shuffle_array(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generate_pairs(array) {


    return array;
}





async function insert() {

    const file = readFileSync("image_ids.json");
    const image_ids = JSON.parse(file);



}



