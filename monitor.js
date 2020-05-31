#!/usr/bin/env node

let Blackbeard = require('./blackbeard')
// file system module to perform file operations
const fs = require('fs');
function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

var args = process.argv.slice(2);

if(args.length==0) {
    function sort_loop() {
        Blackbeard.sortTorrents()
    }
    var x = 0;
    function rss_loop() {
        // Blackbeard.getFeeds()
        let JsonDB = require('./json.db/json.db')
        let AllShows = require('./scripts/all-shows')

    }

    setInterval(sort_loop, 5000)
    setInterval(rss_loop, 3000)

    rss_loop()

}
