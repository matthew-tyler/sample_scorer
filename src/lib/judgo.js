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


/**
 * Judgo is a class representing the state and logic of a judgment process. It maintains the relationships
 * between documents, organizes them into a tree-like structure, and provides methods for comparing and
 * ranking the documents based on user input.
 *
 * @example
 * const judgo = new Judgo(documents, database);
 * await judgo.greater_than();
 */
export class Judgo {

    /**
     * Constructs a new Judgo instance with the given documents and database.
     * @param {Object[]} documents - Array of documents to be ranked.
     * @param {PBWrapper} database - The PocketBase wrapper instance to interact with the database.
     */
    constructor(documents, database) {
        if (documents.length > 0) {
            this.documents = documents.map((document) => new HeapNode(document));
            this.root = this.#next();
            this.next_node = this.#next();
        }
        this.equivalence_classes = []
        this.database = database;
    }

    /**
     * Constructs a Judgo instance from a plain object, converting plain objects into HeapNodes as needed.
     * @param {Object} object - The object to convert into a Judgo instance.
     * @returns {Judgo} Returns a new Judgo instance constructed from the object.
     */
    static fromObject(object, database) {
        const judgo = new Judgo([], database);
        judgo.documents = object.documents.map(document => HeapNode.fromObject(document));
        judgo.root = HeapNode.fromObject(object.root)
        judgo.next_node = HeapNode.fromObject(object.next_node)
        judgo.equivalence_classes = object.equivalence_classes
        return judgo;
    }

    /**
     * Asynchronously constructs a Judgo instance from the database.
     * @param {PBWrapper} database - The PocketBase wrapper instance to interact with the database.
     * @returns {Promise<Judgo|null>} Returns a Promise resolving to a new Judgo instance, or null if not found.
     */
    static async fromDatabase(database) {
        const judgo_obj = await database.read_state();
        if (judgo_obj !== null) {
            return Judgo.fromObject(judgo_obj, database);
        }

        return null;
    }

    /**
     * Returns a plain object version of the Judgo instance without the database property.
     * @returns {Object} Returns a plain object version of the Judgo instance.
     */
    toObject() {
        // Create a new object to hold the plain object version
        const plainObject = {};

        // Copy the necessary properties from the current instance
        plainObject.documents = this.documents.map(document => document);
        plainObject.root = this.root;
        plainObject.next_node = this.next_node;
        plainObject.equivalence_classes = [...this.equivalence_classes];

        // Return the plain object version
        return plainObject;
    }
    /**
     * Compares this Judgo instance with another for equality.
     * @param {Judgo} otherJudgo - The other Judgo instance to compare.
     * @returns {boolean} Returns true if the Judgo instances are equal, false otherwise.
     */
    equals(otherJudgo) {
        console.log(1);
        if (!otherJudgo || !(otherJudgo instanceof Judgo)) return false;
        console.log(2);
        if (!this.root.equals(otherJudgo.root)) return false;
        console.log(3);
        if (!this.next_node.equals(otherJudgo.next_node)) return false;
        console.log(4);
        if (this.documents.length !== otherJudgo.documents.length) return false;
        console.log(5);
        if (!this.documents.every((document, index) => document.equals(otherJudgo.documents[index]))) return false;
        console.log(6);
        if (!this.equivalence_classes.every((value, index) => {
            const otherValue = otherJudgo.equivalence_classes[index];
            return JSON.stringify(value) === JSON.stringify(otherValue);
        })) return false;
        console.log(7);
        return true;
    }

    /**
     * @private
     * Retrieves the next HeapNode from the internal documents array and updates the state as needed.
     * @returns {HeapNode|null} Returns the next HeapNode if available, or null if no more documents or children.
     */
    #next() {
        if (this.documents.length > 0) {
            return this.documents.shift();
        }

        this.equivalence_classes.push(this.root.equivalenceClass);
        this.database.write_equivalence_class(this.root.equivalenceClass, this.equivalence_classes.length);

        if (this.root.children.length === 0) {
            this.root = new HeapNode('');
            console.log("No more documents or children");
            return new HeapNode('');
        }

        this.documents = this.root.children;
        this.root = this.#next();

        return this.#next();
    }

    /**
     * Handles the "greater than" comparison between the current root and the next node, and updates the state accordingly.
     * @returns {Promise<void>}
     */
    async greater_than() {
        await this.database.write_comparison(this.root, '>', this.next_node)
        this.root = this.root.greaterThan(this.next_node);
        this.next_node = this.#next();
        await this.database.write_state(this.toObject());
    }

    /**
    * Handles the "equal" comparison between the current root and the next node, and updates the state accordingly.
    * @returns {Promise<void>}
    */
    async equal() {
        await this.database.write_comparison(this.root, '=', this.next_node)
        this.root = this.root.equal(this.next_node);
        this.next_node = this.#next();
        await this.database.write_state(this.toObject());
    }


    /**
     * Handles the "less than" comparison between the current root and the next node, and updates the state accordingly.
     * @returns {Promise<void>}
     */
    async less_than() {
        await this.database.write_comparison(this.root, '<', this.next_node)
        this.root = this.root.lessThan(this.next_node);
        this.next_node = this.#next();
        await this.database.write_state(this.toObject());
    }
}


/**
 * PBWrapper is a class that serves as a wrapper around PocketBase, providing functionality
 * for handling and managing the state of a Judgo instance. It includes methods for reading and writing
 * comparisons, equivalence classes, and the overall state of the Judgo process.
 * 
 * @example
 * const pbWrapper = await PBWrapper.create(pocketbase, user_id);
 * const judgo_instance = new Judgo(documents, pbWrapper);
 */
export class PBWrapper {
    /**
     * Creates an instance of the class, initializing it with the given pocketbase and user_id.
     * @param {PocketBase} pocketbase - PocketBase JS Client.
     * @param {string} user_id - The pocketbase user's identifier.
     * @param {string} judgostate_id - The judgo state's identifier.
     */
    constructor(pocketbase, user_id, judgostate_id) {
        this.pocketbase = pocketbase;
        this.pocketbase.autoCancellation(false);
        this.user_id = user_id;
        this.judgostate_id = judgostate_id;
        this.call_count = 0;
    }

    /**
     * Asynchronously creates an instance of the PBWrapper class, handling error cases for the specified user.
     * @param {PocketBase} pocketbase - PocketBase JS Client.
     * @param {string} user_id - The pocketbase user's identifier.
     * @returns {Promise<PBWrapper>} Returns a Promise resolving to a new PBWrapper instance.
     */
    static async create(pocketbase, user_id) {
        const record = await pocketbase.collection('JudgoStates').getFirstListItem(`rater="${user_id}"`)
            .catch((error) => {
                if (error.status == 404) {
                    return pocketbase.collection("JudgoStates").create({ "rater": user_id }).catch(() => null)
                }
            });

        const judgostate_id = record.id
        return new PBWrapper(pocketbase, user_id, judgostate_id);
    }

    /**
     * Writes or handles the comparison between two nodes based on the specified order.
     * @param {HeapNode} node1 - The first node to be compared.  
     * @param {'>'|'<'|'='} order - The order symbol representing the comparison to be made ('>', '<', or '=').
     * @param {HeapNode} node2 - The second node to be compared.
     * @returns {Promise<boolean>} Returns a Promise resolving to a boolean indicating success or failure.
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


    /**
     * Writes an equivalence class with its order.
     * @param {string[]} equivalenceClass - An array of image_ids to be compared.
     * @param {'>'|'<'|'='} order - The order symbol representing the comparison to be made ('>', '<', or '=').
     * @returns {Promise<boolean>} Returns a Promise resolving to a boolean indicating success or failure.
     */
    async write_equivalence_class(equivalenceClass, order) {

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
            "neighbours": nodes.map((node) => node.id),
            "order": order
        };

        return await this.pocketbase.collection("EquivalenceClass").create(data).then(() => true).catch(() => false);
    }

    /**
     * Writes or handles the state of a judgo instance, typically converting it to a JSON string.
     * @param {Judgo} judgo_instance - The instance of the Judgo class or similar to be handled.
     * @returns {Promise<boolean>} Returns a Promise resolving to a boolean indicating success or failure.
     */
    async write_state(judgo_instance) {
        const json_string = JSON.stringify(judgo_instance);
        return await this.pocketbase.collection('JudgoStates').update(this.judgostate_id, { "current_state": json_string }).then(() => true).catch((error) => console.log(error));
    }

    /**
     * Reads the current state of a judgo instance.
     * @returns {Promise<string|null>} Returns a Promise resolving to a JSON string representing the state, or null if not found.
     */
    async read_state() {
        const record = await this.pocketbase.collection("JudgoStates").getOne(this.judgostate_id).catch(() => null);
        if (record == null) {
            return null;
        }
        return record.current_state;
    }

    /**
     * Reads relations and constructs the equivalent classes and nodes (TBD).
     * @returns {Promise<any|null>} Returns a Promise resolving to the extracted relations, or null if not found.
     */
    async read_from_relations() {
        const eq_classes_record = await this.pocketbase.collection("EquivalenceClass").getFullList({ filter: `rater="${this.user_id}"`, expand: "neighbours", sort: '-created' }).catch(() => null);
        const nodes_record = await this.pocketbase.collection("Nodes").getFullList({ filter: `rater="${this.user_id}"`, expand: "parent" }).catch(() => null);

        if (eq_classes_record == null || nodes_record == null) {
            return null;
        }

        const eq_classes = eq_classes_record.items.map(item => item.neighbours);

    }
}