let JsonDB = require('../json.db/json.db')

var objs = [
    "actors",
    "directors",
    "writers",
    "genres"
]

objs.forEach((obj)=>{
    var objHandle = new JsonDB(obj)
    objHandle.save({list:[]})
})
