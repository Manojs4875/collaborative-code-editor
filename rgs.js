const RGA = require("./Crdt/rga");
const rga = new RGA("A");

rga.loadText("HEL");

console.log(rga.getText());

const op = rga.insert("init:2", "X");

console.log(op);
console.log(rga.getText());