let Blackbeard = require('./blackbeard')
// file system module to perform file operations
const fs = require('fs');

var args = process.argv.slice(2);

if(args.length!=0) {
    var i = 0
    var title = ''
    args.forEach((arg) => {
        if(i==0) {
            title = arg
        }
        if(i==1) {
            Blackbeard.addUrl(arg, title, function(res){
                console.log(res)
                // stringify JSON Object
                var jsonContent = JSON.stringify(res);
                fs.writeFile("data/torrent."+res.hashString+".json", jsonContent, 'utf8', function (err) {
                    if (err) {
                        console.log("An error occured while writing JSON Object to File.");
                        return console.log(err);
                    }
                    console.log("JSON file has been saved.");
                });
            })
        }
        i++
    })
}
