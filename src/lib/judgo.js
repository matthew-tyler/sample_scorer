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
        this.round_number = 1;
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
        judgo.round_number = object.equivalence_classes.length;
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
        return new Judgo(database.documents, database);
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
        if (!otherJudgo || !(otherJudgo instanceof Judgo)) return false;
        if (!this.root.equals(otherJudgo.root)) return false;
        if (!this.next_node.equals(otherJudgo.next_node)) return false;
        if (this.documents.length !== otherJudgo.documents.length) return false;
        if (!this.documents.every((document, index) => document.equals(otherJudgo.documents[index]))) return false;
        if (!this.equivalence_classes.every((value, index) => {
            const otherValue = otherJudgo.equivalence_classes[index];
            return JSON.stringify(value) === JSON.stringify(otherValue);
        })) return false;
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
        this.round_number = this.equivalence_classes.length;

        if (this.root.children.length === 0) {
            return null;
        }

        this.documents = this.root.children;
        this.root = this.#next();

        return this.#next();
    }

    async #next_category() {
        await this.database.next_category();
        this.documents = this.database.documents.map((document) => new HeapNode(document));
        this.root = this.#next();
        this.next_node = this.#next();

        this.equivalence_classes = [];
    }

    /**
     * Handles the "greater than" comparison between the current root and the next node, and updates the state accordingly.
     * @returns {Promise<void>}
     */
    async greater_than() {
        this.root = this.root.greaterThan(this.next_node);
        this.next_node = this.#next();
        if (this.next_node == null) {
            await this.#next_category();
        }
        await this.database.write_state(this.toObject());
    }

    /**
    * Handles the "equal" comparison between the current root and the next node, and updates the state accordingly.
    * @returns {Promise<void>}
    */
    async equal() {
        this.root = this.root.equal(this.next_node);
        this.next_node = this.#next();
        if (this.next_node == null) {
            await this.#next_category();
        }
        await this.database.write_state(this.toObject());
    }


    /**
     * Handles the "less than" comparison between the current root and the next node, and updates the state accordingly.
     * @returns {Promise<void>}
     */
    async less_than() {
        this.root = this.root.lessThan(this.next_node);
        this.next_node = this.#next();
        if (this.next_node == null) {
            await this.#next_category();
        }
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
    constructor(pocketbase, user_id, judgostate_id, documents) {
        this.pocketbase = pocketbase;
        this.pocketbase.autoCancellation(false);
        this.user_id = user_id;
        this.judgostate_id = judgostate_id;
        this.documents = documents;
    }

    /**
     * Asynchronously creates an instance of the PBWrapper class, handling error cases for the specified user.
     * @param {PocketBase} pocketbase - PocketBase JS Client.
     * @param {string} user_id - The pocketbase user's identifier.
     * @returns {Promise<PBWrapper>} Returns a Promise resolving to a new PBWrapper instance.
     */
    static async create(pocketbase, user_id, image_lists) {
        const record = await pocketbase.collection('JudgoStates').getFirstListItem(`rater="${user_id}" && completed=false`)
            .catch((error) => {
                if (error.status == 404) {
                    return pocketbase.collection("JudgoStates").create({ "rater": user_id, "category": image_lists[0] }).catch(() => null)
                }
            });
        const judgostate_id = record.id
        const docs = await pocketbase.collection('image_lists').getOne(image_lists[0]);
        return new PBWrapper(pocketbase, user_id, judgostate_id, docs.image_ids);
    }

    async next_category() {
        await this.pocketbase.collection('JudgoStates').update(this.judgostate_id, { "completed": true });
        const record = await this.pocketbase.collection('JudgoStates').getFullList({ filter: `rater='${this.user_id}'` })
        const user_record = await this.pocketbase.collection('users').getOne(this.user_id, { expand: this.documents })
        const completed = record.map((record) => record.category)

        if (completed.length === 8) {
            this.judgostate_id = '';
            this.documents = ["game", "over"];
            return;
        }

        const next = user_record.documents.find(doc => !completed.includes(doc));

        const judgo_state = await this.pocketbase.collection('JudgoStates').create({
            "rater": this.user_id,
            "category": next,
        }).catch((err) => console.log(err));

        const docs = await this.pocketbase.collection('image_lists').getOne(next).catch(error => console.log(error));

        this.judgostate_id = judgo_state.id;
        this.documents = docs.image_ids;
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

}