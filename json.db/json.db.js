const path = require('path');
const openJson = require('./open-json-file');
const fs = require('fs');

function JsonObj(obj) {
    this.obj = obj
    this.name = this.obj.charAt(0).toUpperCase() + this.obj.slice(1)
    this.get = function(cb = function() {}) {
        // console.log("//> get "+this.obj)
        openJson(this.obj, cb)
    }
    this.add = function(insertObj, cb=function(){}) {
        var obj_name = this.name
        this.get((res_obj) => {
            res_obj.list.push(insertObj)
            var jsonContent = JSON.stringify(res_obj);
            fs.writeFile(path.join(__dirname, `/../json/objects/${this.obj}.json`), jsonContent, 'utf8', function(err) {
                if (err) {
                    console.log("An error occured while writing JSON Object to File.");
                    return console.log(err);
                }
                console.log(`${obj_name.slice(0, obj_name.length-1)} added:`)
                console.log(insertObj)
                cb(res_obj)
            });
        })
    }
    this.remove = function(id, cb=function(){}) {
        var obj_name = this.obj
        this.get((res_obj) => {
            var removed_obj = false
            res_obj.list.forEach((_obj, i) => {
                if (_obj.id == id) {
                    res_obj.list.splice(i, 1)
                    removed_obj = _obj
                }
            })
            if (removed_obj) {
                var jsonContent = JSON.stringify(res_obj);
                fs.writeFile(path.join(__dirname, `/../json/objects/${this.obj}.json`), jsonContent, 'utf8', function(err) {
                    if (err) {
                        console.log("An error occured while writing JSON Object to File.");
                        return console.log(err);
                    }
                    console.log(`${obj_name.slice(0, obj_name.length-1)} removed:`)
                    console.log(removed_obj)
                    cb(removed_obj)
                });
            } else {
                console.log(`Could not find ${obj_name} to remove.`)
                cb(false)
            }
        })
    }
    this.save = function(data, cb=function(){}) {
        var obj_name = this.name
        var jsonContent = JSON.stringify(data);
        fs.writeFile(path.join(__dirname, `/../json/objects/${this.obj}.json`), jsonContent, 'utf8', function(err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
            // console.log(`${obj_name} saved.`)
            cb(data)
        });
    }
}

module.exports = JsonObj
