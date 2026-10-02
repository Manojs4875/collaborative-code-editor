const RGA = require("./Crdt/rga");
const rga = new RGA("A");

rga.loadText("HEL");

console.log(rga.getElementAtPosition(0));  // init:1
console.log(rga.getElementAtPosition(1));  // init:2
console.log(rga.getElementAtPosition(2));  // init:3
console.log(rga.getElementAtPosition(3));  // null

console.log(rga.getElementBeforePosition(0)); // null
console.log(rga.getElementBeforePosition(1)); // init:1
console.log(rga.getElementBeforePosition(2)); // init:2
console.log(rga.getElementBeforePosition(3)); // init:3