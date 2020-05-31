const path = require('path');
const fs = require('fs');
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

var obj

rl.question("Object name:\n", function(res) {
    obj = res
    rl.close();
});

rl.on("close", function() {
    var blank = {
        "list": []
    }

    var jsonContent = JSON.stringify(blank);
    fs.writeFile(path.join(__dirname, `/../json/objects/${obj}.json`), jsonContent, 'utf8', function(err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log("jSON object '" + obj + "' added.")
    });
})
