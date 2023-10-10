

/**
 * Represents a node within a heap structure, containing an equivalence class
 * and children nodes that are less than the top item.
 */
class HeapNode {
    /**
     * Creates a HeapNode instance with the specified value.
     * @param {any} value - The initial value for the equivalence class.
     */
    constructor(value) {
        this.equivalenceClass = [value]; // Top item
        this.children = []; // Less than the top. 
    }

    /**
     * Recursively constructs a HeapNode from a plain object, including children.
     * @param {Object} object - The plain object to convert.
     * @return {HeapNode} The reconstructed HeapNode instance.
     */
    static fromObject(object) {
        const node = new HeapNode(object.equivalenceClass[0]);
        node.equivalenceClass = object.equivalenceClass;
        node.children = object.children.map(child => HeapNode.fromObject(child));
        return node;
    }

    /**
     * Compares this HeapNode instance with another for equality.
     * @param {HeapNode} otherNode - The other HeapNode to compare.
     * @return {boolean} True if the instances are equivalent, false otherwise.
     */
    equals(otherNode) {
        if (!otherNode || !(otherNode instanceof HeapNode)) return false;
        if (JSON.stringify(this.equivalenceClass) !== JSON.stringify(otherNode.equivalenceClass)) return false;
        if (this.children.length !== otherNode.children.length) return false;
        return this.children.every((child, index) => child.equals(otherNode.children[index]));
    }

    /**
     * Combines this HeapNode with another, concatenating the equivalence classes
     * and children.
     * @param {HeapNode} otherNode - The other HeapNode to combine.
     * @return {HeapNode} This modified HeapNode instance.
     */
    equal(otherNode) {
        this.equivalenceClass = this.equivalenceClass.concat(otherNode.equivalenceClass);
        this.children = this.children.concat(otherNode.children);
        return this;
    }

    /**
    * Adds another HeapNode as a child of this one.
    * @param {HeapNode} otherNode - The other HeapNode to add as a child.
    * @return {HeapNode} This modified HeapNode instance.
    */
    greaterThan(otherNode) {
        this.children.push(otherNode);
        return this;
    }


    /**
     * Returns the other HeapNode with this one added as a child.
     * @param {HeapNode} otherNode - The other HeapNode to modify.
     * @return {HeapNode} The modified other HeapNode instance.
     */
    lessThan(otherNode) {
        return otherNode.greaterThan(this);
    }

    /**
     * Converts the HeapNode to a human-readable string representation.
     * @return {string} The string representation of this HeapNode.
     */
    toString() {
        const childStrings = this.children.map((c) => c.toString()).join(", ");
        return `${this.equivalenceClass} => (${childStrings})`;
    }
}


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
            .map((doc_list) => new HeapNode().equivalenceClass = doc_list)

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

        if (this.sort_list.length !== 0) {

            this.middle = this.#middle_index()
            this.current_comparison_element = this.main_list[this.middle]



        } else if (this.document_lists.length !== 0) {
            this.sort_list = document_lists.pop();

            this.current_upper = this.main_list.length - 1;
            this.current_lower = 0;

            this.list_upper = this.current_upper;
            this.list_lower = this.current_lower

            this.middle = this.#middle_index();
            this.current_comparison_element = this.main_list[this.middle]
            this.current_sort_element = this.sort_list.shift();
        } else {
            console.log("GAME OVER MAN");
        }

    }


    #middle_index() { return Math.floor((this.upper + this.lower) / 2) }


    async greater_than() {



        // this.current_sort_element > this.current_comparison_element
        this.current_upper = this.middle - 1;

        // if sort comparison_element bigger than sort element then low bound must move to mid + 1.

        if (this.current_upper < this.current_lower) {
            // insert above this.middle

            // shift to next element adjusting the new list upper or lower bound.

            // if in TOP mode then the the list upper bound is equal to where this element is inserted -1

            // if in BOT mode then the list lower bound is equal to where this element is inserted + 1 
        } else {

            this.#next();
        }

        // if sort_element is bigger than comparison element, then upper bound = mid - 1


    }

    async equal() {

        this.main_list[this.middle].equal(this.current_sort_element);

        if (this.mode === "TOP") {
            this.list_upper = this.middle;
        } else {
            this.list_lower = this.middle;
        }

        this.mode = "BOT"
        this.#next()
    }

    async less_than() {
        this.current_lower = this.middle + 1;

        if (this.current_upper > this.current_lower) {
            // opposite of greater than.
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