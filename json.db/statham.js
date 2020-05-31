// person.js
// 'use strict';
let openFile = require('./open')
let saveFile = require('./save')

class Statham {

    // construct Statham object
    // open json object files and assign to data object
    constructor(ent, io) {

        this.entities = []

        this.io = io

        var that = this

        if (Array.isArray(ent)) {
            // array variant, deals with multiple entities

            ent.forEach(obj_name => {

                (async function() {

                    var obj = await openFile(obj_name)
                    obj.name = obj_name
                    that.entities.push(obj)

                })();

            })

        } else if (typeof ent == "String") {
            // string variant, deals with one entity

            var obj = openFile(ent)
            obj.name = ent
            this.entities.push(obj)

        }

    }

    read(ent, seq = false) {

        var obj = this.entities.find((x) => x.name == ent)

        if (!seq) {
            // return all

            return obj.list

        } else {

            // get one entity instance by ID
            var findItem = obj.list.find((x) => parseInt(x.id) == parseInt(seq))

            return findItem

        }

    }

    init() {
        var obj = this

        this.webSocket = this.io.of('/web').on('connection', function(socket) {

            // connection
            console.log(`New Statham connection: web client`);

            // database service
            socket.on('utility_function', function(msg) {

                obj.entity_info()
                console.log(obj.read("genres", 20))
                console.log(`Statham response`)
                socket.emit('msg', `jSON.db is on.`)

            })

        })
    }

    entity_info() {
        console.log("Statham.db entity info")
        this.entities.forEach(ent => {
            console.log(`${ent.name} has ${ent.list.length} entries`)
        })
    }

    add_ids() {
        this.entities.forEach(ent => {
            if (ent.list.length != 0) {
                if (ent.list[0].id == undefined) {
                    console.log("needs ids")
                    var x = 0
                    ent.list.forEach(item => {
                        //set ID
                        item.id = x
                        x++
                    })
                    saveFile(ent.name, ent)
                }
            }
        })
    }

}

module.exports = Statham
