

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

        // Then sets an upper bound and a lower bound
        this.global_upper_bound = this.main_list.length - 1;
        this.global_lower_bound = 0;

        this.upper = this.global_upper_bound;
        this.lower = this.global_lower_bound;

        this.comparison_index = this.#middle_index(this.upper, this.lower);
        this.mode = "TOP";

        this.current_comparison_element = this.main_list[this.comparison_index]
        this.current_sort_element = this.sort_list.shift();

    }

    static fromObject() { }
    toObject() { }
    equals() { }

    #next() {

        this.comparison_index = this.#middle_index(this.upper, this.lower)
        this.current_comparison_element = this.main_list[this.comparison_index]

        // Takes the top element off of the sort list and binary sort into the main list
        // This sets a new upper bound that we can't go above.
        // Update the upper bound with new upper bound
        //          
        // Takes the bottom element off of the sort list and binary sort into the main list. 
        // Sets new lower bound that we can no longer go below. 
        // Repeat until sorted in and apply to next list etc. 
    }

    #middle_index(high, low) { return Math.floor((high + low) / 2) }


    async greater_than() { }

    async equal() {
        this.main_list[this.comparison_index].equal(this.current_sort_element);
        if (this.mode === "TOP") {
            this.global_upper_bound = this.comparison_index;
        } else {
            this.global_lower_bound = this.comparison_index;
        }


        this.mode = "BOT"
    }

    async less_than() { }
}



let list1 = [[1], [2, 2], [3, 3, 3], [4, 4, 4, 4], [5, 5, 5, 5, 5]]
let list2 = [['a'], ['b'], ['c'], ['d'], ['e']]

let n = 2

list1 = list1.reduce((acc, _, i, arr) => i % n === 0 ? [...acc, arr.slice(i, i + n).flat()] : acc, []).sort((a, b) => b.length - a.length);



let low = 0;
let high = 9;

let middle = Math.floor((low + high) / 2)

console.log(middle);