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

    _get_entity(name) {
        return this.entities.find((x) => x.name == name)
    }

    read(ent, seq = false) {

        var entity = this._get_entity(ent)

        if (!seq) {
            // return all

            return entity.list

        } else {

            // get one entity instance by ID
            var findItem = entity.list.find((x) => parseInt(x.id) == parseInt(seq))

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
            if(ent.list!=undefined) {
                console.log(`${ent.name} has ${ent.list.length} entries`)
            }
        })
    }

    update(ent, id, data) {

        var obj = this.read(ent, id);

        for (var prop in data) {
            if (Object.prototype.hasOwnProperty.call(data, prop)) {
                // for each property of the original object
                var found = false
                for (var _prop in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, _prop)) {
                        if(prop == _prop) {
                            // match, update
                            obj[prop] = data[_prop]
                            found = true
                        }
                    }
                }
                if(!found) {
                    obj[prop] = data[prop]
                }
            }
        }

        saveFile(ent, this._get_entity(ent))

        return obj

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
