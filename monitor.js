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
    function rss_loop() {
        console.clear()
        Blackbeard.getFeed()
    }
    setInterval(sort_loop, 1000)
    setInterval(rss_loop, 100000)

    rss_loop()

}
