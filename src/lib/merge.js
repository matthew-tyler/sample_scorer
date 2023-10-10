

/**
 * A class to merge multiple lists of documents.
 * The merging strategy is based on a binary-like search approach.
 * 
 * @class Merge
 */
class Merge {

    // document_lists = [[[uuid,uuid],[uuid,uuid]], [[uuid,uuid],[uuid,uuid]]]

    /**
     * Constructor for the Merge class.
     * 
     * @param {Array<Array<Array<string>>>} document_lists - An array of lists, where each list contains document UUIDs.
     * @param {number} [group_by=1] - The number of lists to group together and flatten in a single step.
     * @param {Object} database - Reference to the database object.
     */
    constructor(document_lists, group_by = 1, database) {
        // needs to use an array of category lists
        // init document_lists:     
        //      condense each list of documents by some number,
        //      Sort by length from shortest to longest.
        //      grouping each eq class by that num.
        this.document_lists = document_lists.reduce((acc, _, i, arr) => i % group_by === 0 ? [...acc, arr.slice(i, i + group_by).flat()] : acc, [])
            .sort((a, b) => a.length - b.length)

        // Picks the longest as the main list to sort into.
        this.main_list = this.document_lists.pop();

        // Takes the next largest as the sort list
        this.sort_list = this.document_lists.pop();


        this.current_upper = this.main_list.length - 1;
        this.current_lower = 0;

        this.list_upper = this.current_upper;
        this.list_lower = this.current_lower

        this.middle = this.#middle_index();
        this.mode = "TOP";

        this.current_sort_element = this.sort_list.shift();
        this.current_comparison_element = this.main_list[this.middle]

        this.over = false;

    }

    /**
     * Creates a Merge instance from a plain object representation.
     * 
     * This static method helps in deserializing a previously serialized Merge object.
     * 
     * @static
     * @param {Object} obj - The plain object representation of the Merge class instance.
     * @param {Array<Array<string>>} obj.document_lists - An array of lists, where each list contains document UUIDs.
     * @param {Array<string>} obj.main_list - The main list of document UUIDs.
     * @param {Array<string>} obj.sort_list - The list of document UUIDs to be merged into the main list.
     * @param {number} obj.current_upper - The current upper bound in the binary-like search approach.
     * @param {number} obj.current_lower - The current lower bound in the binary-like search approach.
     * @param {number} obj.list_upper - The upper bound of the list to consider for merging.
     * @param {number} obj.list_lower - The lower bound of the list to consider for merging.
     * @param {number} obj.middle - The current middle index for comparison.
     * @param {string} obj.mode - The mode indicating from where the next element is taken ("TOP" or "BOT").
     * @param {string} obj.current_sort_element - The current document UUID from the sort_list for merging.
     * @param {string} obj.current_comparison_element - The current document UUID from the main_list for comparison.
     * 
     * @returns {Merge} A new instance of the Merge class populated with the properties from the provided object.
     */
    static fromObject(obj) {
        // Create a new instance
        let mergeInstance = new Merge(obj.document_lists, undefined, undefined);  // Assuming the second and third arguments aren't required, or available from the object.

        // Populate the instance's properties from the object
        mergeInstance.main_list = obj.main_list;
        mergeInstance.sort_list = obj.sort_list;
        mergeInstance.current_upper = obj.current_upper;
        mergeInstance.current_lower = obj.current_lower;
        mergeInstance.list_upper = obj.list_upper;
        mergeInstance.list_lower = obj.list_lower;
        mergeInstance.middle = obj.middle;
        mergeInstance.mode = obj.mode;
        mergeInstance.current_sort_element = obj.current_sort_element;
        mergeInstance.current_comparison_element = obj.current_comparison_element;
        // ... set any other properties needed

        return mergeInstance;
    }

    /**
     * Serializes the current Merge instance to a plain object representation.
     * 
     * This method can be used to prepare the instance for storage or transmission.
     * 
     * @returns {Object} A plain object representation of the Merge class instance.
     * @property {Array<Array<string>>} document_lists - An array of lists, where each list contains document UUIDs.
     * @property {Array<string>} main_list - The main list of document UUIDs.
     * @property {Array<string>} sort_list - The list of document UUIDs to be merged into the main list.
     * @property {number} current_upper - The current upper bound in the binary-like search approach.
     * @property {number} current_lower - The current lower bound in the binary-like search approach.
     * @property {number} list_upper - The upper bound of the list to consider for merging.
     * @property {number} list_lower - The lower bound of the list to consider for merging.
     * @property {number} middle - The current middle index for comparison.
     * @property {string} mode - The mode indicating from where the next element is taken ("TOP" or "BOT").
     * @property {string} current_sort_element - The current document UUID from the sort_list for merging.
     * @property {string} current_comparison_element - The current document UUID from the main_list for comparison.
     */
    toObject() {
        return {
            document_lists: this.document_lists,
            main_list: this.main_list,
            sort_list: this.sort_list,
            current_upper: this.current_upper,
            current_lower: this.current_lower,
            list_upper: this.list_upper,
            list_lower: this.list_lower,
            middle: this.middle,
            mode: this.mode,
            current_sort_element: this.current_sort_element,
            current_comparison_element: this.current_comparison_element
            // ... add any other relevant fields
        };
    }

    /**
     * Checks if the current Merge instance is equal to another Merge instance.
     * 
     * Two Merge instances are considered equal if their properties have the same values.
     * 
     * @param {Merge} other - Another instance of the Merge class to compare with.
     * 
     * @returns {boolean} `true` if the instances are equal, otherwise `false`.
     */
    equals(other) {
        if (!(other instanceof Merge)) {
            return false;
        }

        // Compare each field. Here's an example for some fields:
        return this.document_lists === other.document_lists &&
            this.main_list === other.main_list &&
            this.sort_list === other.sort_list &&
            this.current_upper === other.current_upper &&
            this.current_lower === other.current_lower &&
            // ... compare other fields similarly
            this.current_comparison_element === other.current_comparison_element;
    }

    /**
     * Updates the current middle index and the corresponding comparison element.
     * 
     * This private method recalculates the middle index and sets the current_comparison_element 
     * based on the newly calculated middle index.
     * 
     * @private
     */
    #next() {
        this.middle = this.#middle_index()
        this.current_comparison_element = this.main_list[this.middle]
    }


    /**
     * Updates the current sort element and other related properties for the merge process.
     * 
     * This private method performs the following:
     * 1. If the sort list is empty but there are still document lists, it prepares the next sort list.
     * 2. Depending on the current mode ("TOP" or "BOT"), it sets the next sort element from either the end or the start of the sort list.
     * 3. Updates boundaries, recalculates the middle index, and sets the new comparison element.
     * 4. If no more elements remain for sorting, it logs an end message and sets the 'over' flag.
     * 
     * @private
     */
    #next_sort_element() {

        if (this.sort_list.length === 0 && this.document_lists.length !== 0) {
            this.sort_list = this.document_lists.pop();
            this.current_upper = this.main_list.length - 1;
            this.current_lower = 0;
        }

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
            this.current_comparison_element = this.main_list[this.middle];
        } else {
            console.log("GAME OVER MAN");
            this.over = true;
        }
    }


    /**
     * Calculates the middle index based on the current upper and lower bounds.
     * 
     * This private method returns the floor value of the average of the current upper 
     * and lower bounds, effectively determining the midpoint for the binary-like search approach.
     * 
     * @private
     * @returns {number} The calculated middle index.
     */
    #middle_index() { return Math.floor((this.current_upper + this.current_lower) / 2) }


    /**
     * Updates the state after determining that the current sort element is greater than the comparison element.
     * 
     * This asynchronous method adjusts the upper boundary and possibly inserts the current sort element 
     * into the main list. Depending on the mode ("TOP" or "BOT"), it updates the list's boundaries.
     * If the new upper boundary is below the lower boundary, it proceeds to the next sort element; 
     * otherwise, it updates the middle index for the next comparison.
     * 
     * @async
     */
    async greater_than() {
        this.current_upper = this.middle - 1;

        if (this.current_upper < this.current_lower) {
            this.main_list.splice(this.current_lower, 0, this.current_sort_element);

            if (this.mode === "TOP") {

                this.list_lower = this.current_lower + 1;
            } else {
                this.list_upper = this.current_lower - 1;
            }

            this.#next_sort_element();
        } else {
            this.#next();
        }
    }


    /**
     * Handles the scenario when the current sort element is determined to be equal to the comparison element.
     * 
     * This asynchronous method merges the current sort element with the comparison element in the main list.
     * Depending on the mode ("TOP" or "BOT"), it adjusts the list boundaries accordingly.
     * It then proceeds to set the next sort element for further processing.
     * 
     * @async
     */
    async equal() {

        this.main_list[this.middle] = [...this.main_list[this.middle], ...this.current_sort_element];

        if (this.mode === "TOP") {
            this.list_lower = this.middle + 1;
        } else {
            this.list_upper = this.middle - 1;
        }

        this.#next_sort_element();
    }

    /**
     * Updates the state after determining that the current sort element is less than the comparison element.
     * 
     * This asynchronous method adjusts the lower boundary based on the middle index. If the updated 
     * lower boundary surpasses the upper boundary, the current sort element is inserted into the main list. 
     * Depending on the mode ("TOP" or "BOT"), it then updates the list's boundaries.
     * Afterwards, either the next sort element is prepared or the middle index is recalculated for the next comparison.
     * 
     * @async
     */
    async less_than() {
        this.current_lower = this.middle + 1;

        if (this.current_lower > this.current_upper) {
            this.main_list.splice(this.current_lower, 0, this.current_sort_element);

            if (this.mode === "TOP") {
                this.list_lower = this.current_lower + 1;
            } else {
                this.list_upper = this.current_lower - 1;
            }

            this.#next_sort_element();
        } else {
            this.#next();
        }
    }
}


function* range(low, high) {
    while (low <= high) {
        yield [low];
        low++;
    }
}


let arr1 = [...range(1, 100)].sort((a, b) => b - a)
let arr2 = [...range(23, 150)].sort((a, b) => b - a)

let doc_list = [arr1, arr2]



let test_merge = new Merge(doc_list)


while (!test_merge.over) {

    if (test_merge.current_sort_element[0] === test_merge.current_comparison_element[0]) {
        test_merge.equal()
    } else if (test_merge.current_sort_element[0] >= test_merge.current_comparison_element[0]) {
        test_merge.greater_than();
    } else if (test_merge.current_sort_element[0] <= test_merge.current_comparison_element[0]) {
        test_merge.less_than();
    }
}

// console.log(test_merge);


let main_list = test_merge.main_list


let prev_num = undefined;

for (let arr of main_list) {

    if (!(arr.every(val => val === arr[0]))) {
        console.log("ERROR");
        break;
    }

    if (prev_num === undefined) {
        prev_num = arr[0]
        continue;
    }

    if (prev_num < arr[0]) {
        console.log("ERROR");
        break;
    }

    prev_num = arr[0]

}

console.log("SUCCES?");

// console.log(main_list);