const path = require('path');
const openJson = require('./open-json-file');
const fs = require('fs');

module.exports = {
    shows: function(cb) {
        openJson("shows", cb)
    },
    addShow: function(name, id, cb) {
        this.shows((res_shows) => {
            res_shows.list.push({
                name: name,
                id: id
            })
            var jsonContent = JSON.stringify(res_shows);
            fs.writeFile(path.join(__dirname , '/../json/shows.json'), jsonContent, 'utf8', function(err) {
                if (err) {
                    console.log("An error occured while writing JSON Object to File.");
                    return console.log(err);
                }
                console.log("Show added: " + name)
                cb(res_shows)
            });
        })
    },
    removeShow: function(id, cb) {
        this.shows((res_shows) => {
            var removed_show = false
            res_shows.list.forEach((show, i)=>{
                if(show.id==id) {
                    res_shows.list.splice(i, 1)
                    removed_show = show
                }
            })
            console.log(res_shows)
            if(removed_show) {
                var jsonContent = JSON.stringify(res_shows);
                fs.writeFile(path.join(__dirname , '/../json/shows.json'), jsonContent, 'utf8', function(err) {
                    if (err) {
                        console.log("An error occured while writing JSON Object to File.");
                        return console.log(err);
                    }
                    console.log("Show removed: " + removed_show.name)
                    cb(removed_show)
                });
            } else {
                console.log("Could not find show to remove.")
                cb(false)
            }
        })
    },
}
