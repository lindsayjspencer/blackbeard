let Blackbeard = require('./blackbeard')
// file system module to perform file operations
const fs = require('fs');

const readline = require("readline");

var args = process.argv.slice(2);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

if (args.length != 0) {
    var i = 0
    var title = ''
    args.forEach((arg) => {

        rl.question("Torrent name:\n", function(name) {
            if (name == '') {
                title = '.'
            } else {
                title = name
            }
            rl.close();
        });

        rl.on("close", function() {
            Blackbeard.addUrl(arg, title, function(res) {
                console.log(res)
                // stringify JSON Object
                var jsonContent = JSON.stringify(res);
                fs.writeFile("data/torrent." + res.hashString + ".json", jsonContent, 'utf8', function(err) {
                    if (err) {
                        console.log("An error occured while writing JSON Object to File.");
                        return console.log(err);
                    }
                    console.log("JSON file has been saved.");
                });
            })
        })
    })
} else {

    var title, maglink

    rl.question("Torrent link:\n", function(torlink) {
        maglink = torlink
        rl.close();
    });

    rl.on("close", function() {

        const rl2 = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })

        rl2.question("Torrent name:\n", function(name) {
            if (name == '') {
                title = '.'
            } else {
                title = name
            }
            rl2.close();
        });

        rl2.on("close", function() {
            Blackbeard.addUrl(maglink, title, function(res) {
                console.log(res)
                // stringify JSON Object
                var jsonContent = JSON.stringify(res);
                fs.writeFile("data/torrent." + res.hashString + ".json", jsonContent, 'utf8', function(err) {
                    if (err) {
                        console.log("An error occured while writing JSON Object to File.");
                        return console.log(err);
                    }
                    console.log("JSON file has been saved.");
                });
            })
        })

    })

}
