let openFile = require('./open')
let saveFile = require('./save')

class StathamDb {

    // Construct StathamDb
    constructor(ent) {

        this.entities = []

        if (Array.isArray(ent)) {
            // array variant, deals with multiple entities

            ent.forEach(obj_name => {

                var obj = openFile(obj_name)
                obj.name = obj_name
                this.entities.push(obj)

            })

        } else if (typeof ent == "string") {
            // string variant, deals with one entity

            var obj = openFile(ent)
            obj.name = ent
            this.entities.push(obj)

        }

    }

    getEntity(ent) {
        return this.entities.find((x) => x.name == ent)
    }

    async save(ent) {
        let entity = this.getEntity(ent)
        let file = await saveFile(entity.name, entity);
        return file;
    }

    create(ent, data) {

        let entity = this.getEntity(ent)

        // add ID
        if (data.id == undefined) {
            data.id = entity.list.length + 1
        } else {
            var findId = entity.list.findIndex((x) => parseInt(x.id) == parseInt(data.id))
            if (findId != -1) {
                data.id = entity.list.length + 1
            }
        }

        entity.list.push(data)

        return data

    }

    delete(ent, id) {

        let entity = this.getEntity(ent)

        var i = entity.list.findIndex((x) => parseInt(x.id) == parseInt(id))

        if (i != -1) {
            entity.list.splice(i, 1)
            return true
        }

        return false

    }

    read(ent, seq = false) {

        let that = this

        let entity = this.getEntity(ent)

        if (!seq) {
            // return all

            return entity.list

        } else {

            var findItems

            switch (typeof seq) {
                case "number":
                    // number
                    // console.log("Number detected, fetching by ID")
                    // get one entity instance by ID
                    findItems = entity.list.find((x) => parseInt(x.id) == parseInt(seq))
                    break;
                case "object":
                    if (Array.isArray(seq)) {
                        // array
                        // console.log("Array detected, fetching by IDs")
                        findItems = []
                        seq.forEach((id) => {
                            findItems.push(
                                entity.list.find((x) => parseInt(x.id) == parseInt(id))
                            )
                        })
                    } else {
                        // object?
                        // console.log("Object detected, filtering by properties")
                        findItems = []
                        entity.list.forEach((e) => {
                            var stay = true
                            for (var prop in seq) {
                                if (Object.prototype.hasOwnProperty.call(seq, prop)) {
                                    if (e[prop] != undefined) {
                                        if (e[prop] == seq[prop]) {
                                            found = true
                                        }
                                    }
                                    // for each property of the original object
                                    var found = false
                                    if (!found) {
                                        stay = false
                                    }
                                }
                            }
                            if (stay) {
                                findItems.push(e)
                            }
                        })
                    }
                    break;
                default:
                    // console.log("no definition")
                    break;
            }

            function expandResult(res) {
                for (var prop in res) {
                    if (Object.prototype.hasOwnProperty.call(res, prop)) {
                        if (Array.isArray(res[prop])) {
                            let response = []
                            res[prop].forEach(join => {
                                response.push( that.read(prop, join) )
                            })
                            res[prop] = response
                        }
                    }
                }
            }

            if (Array.isArray(findItems)) {
                if (findItems.length == 0) {
                    findItems = false
                } else {
                    findItems.forEach(x => expandResult(x))
                }
            } else {
                if (findItems != -1) {
                    expandResult(findItems)
                }
            }

            return findItems

        }

    }

    update(ent, id, data) {

        var obj = this.read(ent, id);

        for (var prop in data) {
            if (Object.prototype.hasOwnProperty.call(data, prop)) {
                // for each property of the original object
                var found = false
                for (var _prop in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, _prop)) {
                        if (prop == _prop) {
                            // match, update
                            obj[prop] = data[_prop]
                            found = true
                        }
                    }
                }
                if (!found) {
                    obj[prop] = data[prop]
                }
            }
        }

        return obj

    }

    add_ids(ent) {

        let entity = this.getEntity(ent)

        if (entity.list.length != 0) {
            if (entity.list[0].id == undefined) {
                console.log("needs ids")
                var x = 0
                entity.list.forEach(item => {
                    //set ID
                    item.id = x
                    x++
                })
                this.save(ent)
            }
        }
    }

    info(ent) {

        let entity = this.getEntity(ent)

        // dump table totals
        lg("Statham.db entity info")
        if (entity.list != undefined) {
            lg(`${entity.name} has ${entity.list.length} entries`)
        }

    }

}

exports.StathamDb = StathamDb
