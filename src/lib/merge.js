
class Merge {

    // document_lists = [[uuid,uuid],[uuid,uuid]]

    /**
     * 
     * @param {[[]]} document_lists 
     * @param {number} group_by 
     * @param {Object} database 
     */
    constructor(document_lists, group_by = 1, database) {
        // needs to use an array of category lists
        // init document_lists:     
        //      condense each list of documents by some number,
        //      Sort by length from shortest to longest.
        //      grouping each eq class by that num.
        this.document_lists = document_lists.reduce((acc, _, i, arr) => i % group_by === 0 ? [...acc, arr.slice(i, i + group_by).flat()] : acc, [])
            .sort((a, b) => a.length - b.length)

        //      
        // Picks the longest as the main list to sort into.
        this.main_list = document_lists.pop();

        // Takes the next largest as the sort list
        this.sort_list = document_lists.pop();


        this.current_upper = this.main_list.length - 1;
        this.current_lower = 0;

        this.list_upper = this.current_upper;
        this.list_lower = this.current_lower

        this.middle = this.#middle_index();
        this.mode = "TOP";

        this.current_sort_element = this.sort_list.shift();
        this.current_comparison_element = this.main_list[this.middle]

    }

    static fromObject() { }
    toObject() { }
    equals() { }

    #next() {

        this.middle = this.#middle_index()
        this.current_comparison_element = this.main_list[this.middle]


    }

    #next_sort_element() {
        if (this.sort_list.length !== 0) {

            if (this.mode === "TOP") {
                this.current_sort_element = this.sort_list.pop();
                this.mode = "BOT";
            } else {
                this.current_sort_element = this.sort_list.shift();
                this.mode = "TOP";
            }

            this.current_upper = this.list_upper;
            this.current_lower = this.list_lower;

            this.middle = this.#middle_index();

        } else if (this.document_lists.length !== 0) {
            this.sort_list = this.document_lists.pop();

            this.current_upper = this.main_list.length - 1;
            this.current_lower = 0;

            this.list_upper = this.current_upper;
            this.list_lower = this.current_lower

            this.middle = this.#middle_index();

            this.current_comparison_element = this.main_list[this.middle]
            if (this.mode === "TOP") {
                this.current_sort_element = this.sort_list.pop();
                this.mode = "BOT";
            } else {
                this.current_sort_element = this.sort_list.shift();
                this.mode = "TOP";
            }

        } else {
            console.log("GAME OVER MAN");
        }
    }

    #middle_index() { return Math.floor((this.upper + this.lower) / 2) }


    async greater_than() {
        // this.current_sort_element > this.current_comparison_element
        this.current_upper = this.middle - 1;

        if (this.current_upper < this.current_lower) {
            // insert at this.current_upper or this.current lower? 
            this.main_list.splice(this.current_lower, 0, this.current_sort_element)

            if (this.mode == "TOP") {
                this.list_upper = this.current_lower + 1;
            } else {
                this.list_lower = this.current_lower - 1;
            }

            this.#next_sort_element();
            // shift to next element adjusting the new list upper or lower bound.


        } else {

            this.#next();
        }
    }

    async equal() {

        this.main_list[this.middle] = [...this.main_list[this.middle], ...this.current_sort_element];

        if (this.mode === "TOP") {
            this.list_upper = this.middle + 1;
        } else {
            this.list_lower = this.middle - 1;
        }

        this.#next_sort_element();
    }


    async less_than() {
        // this.current_sort_element < this.current_comparison_element
        this.current_lower = this.middle + 1;

        if (this.current_lower > this.current_upper) {
            // insert at this.current_lower
            this.main_list.splice(this.current_lower, 0, this.current_sort_element);

            if (this.mode == "TOP") {
                this.list_upper = this.current_lower + 1;
            } else {
                this.list_lower = this.current_lower - 1;
            }

            this.#next_sort_element();

        } else {
            this.#next();
        }
    }

}


let list1 = [[1], [2, 2], [3, 3, 3], [4, 4, 4, 4], [5, 5, 5, 5, 5]]
let list2 = [['a'], ['b'], ['c'], ['d'], ['e']]

let n = 2

list1 = list1.reduce((acc, _, i, arr) => i % n === 0 ? [...acc, arr.slice(i, i + n).flat()] : acc, []).sort((a, b) => b.length - a.length);



let low = 4;
let high = 4;

let middle = Math.floor((low + high) / 2)

console.log(middle);


