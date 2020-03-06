const fs = require('fs');

let rawData = fs.readFileSync('./test/notes.json');
let data = JSON.parse(rawData)
console.log(data);
