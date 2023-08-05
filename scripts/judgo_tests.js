// Testing judgo JS implementation
import PocketBase from 'pocketbase'

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


class Judgo {

    constructor(documents, database) {
        if (documents.length > 0) {
            this.documents = documents.map((document) => new HeapNode(document));
            this.root = this.#next();
            this.next_node = this.#next();
            this.equivalence_classes = []
            this.database = database;
        }
    }

    static fromObject(object) {
        const judgo = new Judgo([]);
        judgo.documents = object.documents.map(document => HeapNode.fromObject(document));
        judgo.root = HeapNode.fromObject(object.root);
        judgo.next_node = HeapNode.fromObject(object.next_node);
        judgo.equivalence_classes = object.equivalence_classes;
        return judgo;
    }

    static async fromDatabase(database) {
        const judgo_obj = await database.read_state();
        if (judgo_obj !== null) {
            return Judgo.fromObject(judgo_obj);
        }
        return null;
    }

    equals(otherJudgo) {
        if (!otherJudgo || !(otherJudgo instanceof Judgo)) return false;
        if (!this.root.equals(otherJudgo.root)) return false;
        if (!this.next_node.equals(otherJudgo.next_node)) return false;
        if (this.documents.length !== otherJudgo.documents.length) return false;
        if (!this.documents.every((document, index) => document.equals(otherJudgo.documents[index]))) return false;
        if (!this.equivalence_classes.every((value, index) => value === otherJudgo.equivalence_classes[index])) return false;
        return true;
    }

    #next() {
        if (this.documents.length > 0) {
            return this.documents.shift();
        }

        this.equivalence_classes.push(this.root.equivalenceClass);
        this.database.write_equivalence_class(this.root.equivalenceClass);

        if (this.root.children.length === 0) {
            this.root = null;
            console.log("No more documents or children");
            return null;
        }

        this.documents = this.root.children;
        this.root = this.#next();

        return this.#next();
    }

    async greater_than() {
        await this.database.write_comparison(this.root, '>', this.next_node)
        this.root = this.root.greaterThan(this.next_node);
        this.next_node = this.#next();
    }

    async equal() {
        await this.database.write_comparison(this.root, '=', this.next_node)
        this.root = this.root.equal(this.next_node);
        this.next_node = this.#next();
    }

    async less_than() {
        await this.database.write_comparison(this.root, '<', this.next_node)
        this.root = this.root.lessThan(this.next_node);
        this.next_node = this.#next();
    }
}


class PBWrapper {
    /**
     * Creates an instance of the class, initializing it with the given pocketbase and user_id.
     * @param {PocketBase} pocketbase - PocketBase JS Client.
     * @param {string} user_id - The pocketbase user's identifier
     */
    constructor(pocketbase, user_id, judgostate_id) {
        this.pocketbase = pocketbase;
        this.pocketbase.autoCancellation(false);
        this.user_id = user_id;
        this.judgostate_id = judgostate_id;
        this.call_count = 0;
    }

    static async create(pocketbase, user_id) {
        const record = await pocketbase.collection('JudgoStates').getFirstListItem(`rater="${user_id}"`)
            .catch((error) => {
                if (error.status == 404) {
                    return pocketbase.collection("JudgoStates").create({ "rater": user_id }).catch(() => null)
                }
            });
        // determine if judgostate_id exists, raise error if not.
        const judgostate_id = record.id
        return new PBWrapper(pocketbase, user_id, judgostate_id);
    }

    /**
     * Writes or handles the comparison between two nodes based on the specified order.
     * @param {HeapNode} node1 - The first node to be compared.  
     * @param {'>'|'<'|'='} order - The order symbol representing the comparison to be made ('>', '<', or '=').
     * @param {HeapNode} node2 - The second node to be compared.
     */
    async write_comparison(node1, order, node2) {

        const node1_record = await this.pocketbase.collection("Nodes").getFirstListItem(`image_id="${node1.equivalenceClass[0]}"`)
            .catch(async (error) => {
                if (error.status == 404) {
                    return await this.pocketbase.collection("Nodes").create({ "rater": `${this.user_id}`, "image_id": node1.equivalenceClass[0] }).catch(() => null)
                }
                return null
            })

        const node2_record = await this.pocketbase.collection("Nodes").getFirstListItem(`image_id="${node2.equivalenceClass[0]}"`)
            .catch(async (error) => {
                if (error.status == 404) {

                    return await this.pocketbase.collection("Nodes").create({ "rater": `${this.user_id}`, "image_id": node2.equivalenceClass[0] }).catch(() => null)
                }
                return null;
            })


        if (node1_record == null || node2_record == null) {
            return false;
        }


        switch (order) {
            case '>':
                return await this.pocketbase.collection("Nodes").update(node2_record.id, { "parent": node1_record.id }).then(() => true).catch(() => false);
            case '<':
                return await this.pocketbase.collection("Nodes").update(node1_record.id, { "parent": node2_record.id }).then(() => true).catch(() => false);
            case '=':
                return await this.pocketbase.collection("Nodes").update(node1_record.id, { "siblings": node2_record.id }).then(async () => {
                    await this.pocketbase.collection("Nodes").update(node2_record.id, { "siblings": node1_record.id }).then(() => true).catch(() => false)
                }).then((response) => response).catch(() => false);
        }
    }


    async write_equivalence_class(equivalenceClass) {

        const nodes = await this.pocketbase.collection("Nodes").getFullList({
            filter: equivalenceClass.map((image_id) => `rater="${this.user_id}" && image_id="${image_id}" `).join("||"),
            '$autoCancel': false
        }).catch((error) => null) // At this point every image_id should have a corresponding node. I think....

        if (nodes == null || nodes.length !== equivalenceClass.length) {
            // we have a problem
            return false;
        }

        const data = {
            "rater": this.user_id,
            "neighbours": nodes.map((node) => node.id)
        };

        return await this.pocketbase.collection("EquivalenceClass").create(data).then(() => true).catch(() => false);
    }

    /**
     * Writes or handles the state of a judgo instance, typically converting it to a JSON string.
     * @param {Judgo} judgo_instance - The instance of the Judgo class or similar to be handled.
     */
    async write_state(judgo_instance) {
        const json_string = JSON.stringify(judgo_instance);
        return await this.pocketbase.collection('JudgoStates').update(this.judgostate_id, { "current_state": json_string }).then(() => true).catch(() => false);
    }

    async read_state() {
        const record = await this.pocketbase.collection("JudgoStates").getOne(this.judgostate_id).catch(() => null);
        if (record == null) {
            return null;
        }
        return record.current_state;
    }

    async read_from_relations() {
        const eq_classes_record = await this.pocketbase.collection("EquivalenceClass").getFullList({ filter: `rater="${this.user_id}"`, expand: "neighbours", sort: '-created' }).catch(() => null);
        const nodes_record = await this.pocketbase.collection("Nodes").getFullList({ filter: `rater="${this.user_id}"`, expand: "parent" }).catch(() => null);

        if (eq_classes_record == null || nodes_record == null) {
            return null;
        }

        const eq_classes = eq_classes_record.items.map(item => item.neighbours);



    }
}


const pocketbase = new PocketBase("http://127.0.0.1:8090")

let user_id = "sv1j6rwjx6hpwvg";

const test_wrapper = await PBWrapper.create(pocketbase, user_id);

// const test_judgo = await Judgo.fromDatabase(test_wrapper);

// console.log(test_judgo);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo() {
    await sleep(2000); // Sleep for 2000 milliseconds
}


const test_array = ["d1", "d2", "d3", "d4"]

const test_judgo = new Judgo(test_array, test_wrapper);

await test_judgo.less_than()
// demo()
await test_judgo.less_than()
// demo()
await test_judgo.greater_than()
// demo()
await test_judgo.equal()
// demo()

// console.log(await test_wrapper.read_state());




// let jsonString = JSON.stringify(test_judgo)
// const plainObject = JSON.parse(jsonString);

// const judgoInstance = Judgo.fromObject(plainObject);

// console.log(test_judgo.equals(judgoInstance));


// console.log(judgoInstance);
// // console.log(test_judgo);

// // console.log(test_judgo); // should be d2 at root
// console.log(JSON.stringify(test_judgo.equivalence_classes));
// // console.log(test_judgo);

