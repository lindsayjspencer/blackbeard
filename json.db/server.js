#!/usr/bin/env node

let openFile = require('../json.db/open')

let socket = require('socket.io-client');

let isActive = false

let activeQuery = false

let queue = [];

let res_obj;

(async function() {

    let jsonobject = await openFile("all-shows")

    var webSocket = socket('http://localhost:4000/json.db')

    function processQueue() {
        if(queue.length!=0) {
            activeQuery = queue.shift()
            // perform query
            res_obj = jsonobject.list.filter((x) => parseInt(x.id)==parseInt(activeQuery.query.id))
            // return
            activeQuery.returnFn(res_obj)
            console.log("Response sent.")
            checkQueue()
        }
    }

    function checkQueue() {
        if(queue.length!=0) {
            processQueue()
        }
    }

    webSocket.on("is-connected", function(data) {
        console.log("Connected to application.")
    });

    webSocket.on("query", function(data, fn) {
        console.log("Query received.")
        queue.push({
            query: data.query,
            returnFn: fn
        })
        checkQueue()
    });

})();
// setInterval(()=>{
//
//     socket.emit("test", { msg: "This is a test message." });
//
// }, 3000)
