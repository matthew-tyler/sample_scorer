// Testing judgo JS implementation
class HeapNode {
    constructor(value) {
        this.equivalenceClass = [value]; // Top item
        this.children = []; // Less than the top. 
    }

    equal(otherNode) {
        this.equivalenceClass = this.equivalenceClass.concat(otherNode.equivalenceClass);
        this.children = this.children.concat(otherNode.children);
        return this;
    }

    greaterThan(otherNode) {
        this.children.push(otherNode);
        return this;
    }

    lessThan(otherNode) {
        return otherNode.greaterThan(this);
    }

    toString() {
        const childStrings = this.children.map((c) => c.toString()).join(", ");
        return `${this.equivalenceClass} => (${childStrings})`;
    }
}




class Judgo {

    constructor(documents) {
        this.documents = documents.map((document) => new HeapNode(document));
        this.root = this.#next();
        this.next_node = this.#next();
        this.equivalence_classes = []
    }


    #next() {
        if (this.documents.length > 0) {

            return this.documents.shift();
        }

        this.documents = this.root.children;
        this.equivalence_classes.push(this.root.equivalenceClass)
        return this.#next();
    }

    greaterThan() {
        this.root = this.root.greaterThan(this.next_node);
        this.next_node = this.#next();
    }

    equal() {
        this.root = this.root.equal(this.next_node);
        this.next_node = this.#next();
    }

    lessThan() {
        this.root = this.root.lessThan(this.next_node);
        this.next_node = this.#next();
    }

}


const test_array = ["d1", "d2", "d3", "d4"]

const test_judgo = new Judgo(test_array);

// console.log(test_judgo);
test_judgo.lessThan()
// console.log(test_judgo);
test_judgo.lessThan()
// // console.log(test_judgo);
test_judgo.greaterThan()
test_judgo.equal()
console.log(test_judgo);


// function doTrial(numDocuments) {
//     let round = 0;
//     let totalSteps = 0;
//     const documents = Array.from({ length: numDocuments }, (_, i) => new HeapNode(i));
//     const equivalenceClasses = [];

//     while (documents.length > 0) {
//         let step = 0;
//         let currentRoundRoot = documents[0];

//         for (let i = 1; i < documents.length; i++) {
//             const nextChoice = Math.floor(Math.random() * 3) - 1;

//             if (nextChoice === -1) {
//                 currentRoundRoot = currentRoundRoot.greaterThan(documents[i]);
//             }
//             if (nextChoice === 0) {
//                 currentRoundRoot = currentRoundRoot.equal(documents[i]);
//             }
//             if (nextChoice === 1) {
//                 currentRoundRoot = currentRoundRoot.lessThan(documents[i]);
//             }

//             step += 1;
//         }

//         documents = currentRoundRoot.children;
//         equivalenceClasses.push(currentRoundRoot.equivalenceClass);

//         totalSteps += step;
//         step = 0;
//         round += 1;
//     }

//     return totalSteps;
// }
