const RGA = require("./Crdt/rga");
const rgaA = new RGA ("A");
const rgaB = new RGA("B");

const op1 = rgaA.insert(null, "A");

rgaB.applyOperation(op1);

console.log("After A inserts A:");
console.log("A:", rgaA.getText());
console.log("B:", rgaB.getText());


const op2 = rgaA.insert("A:1", "B");

rgaB.applyOperation(op2);

console.log("\nAfter A inserts B:");
console.log("A:", rgaA.getText());
console.log("B:", rgaB.getText());


const op3 = rgaB.insert("A:2", "C");


const op4 = rgaA.insert("A:1", "D");

rgaA.applyOperation(op3);

rgaB.applyOperation(op4);



console.log("\nAfter concurrent operations:");

console.log("A:", rgaA.getText());
console.log("B:", rgaB.getText());

console.log(
    "Converged:",
    rgaA.getText() === rgaB.getText()
);




console.log("\nReplica A elements:");
console.log(rgaA.elements);

console.log("\nReplica B elements:");
console.log(rgaB.elements);