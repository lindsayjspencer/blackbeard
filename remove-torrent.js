let Blackbeard = require('./blackbeard')
// file system module to perform file operations
const fs = require('fs');

var args = process.argv.slice(2);

if(args.length!=0) {
    Blackbeard.removeTorrent(parseInt(args[0]))
    console.log("removing "+args[0])
}
