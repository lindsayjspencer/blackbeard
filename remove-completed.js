let Blackbeard = require('./blackbeard')
var copy = require('copy');
var copydir = require('copy-dir');
Blackbeard.getAll(function(){
    Blackbeard.getAllInfo(function(res){
        res.torrents.forEach((t) => {
            if(t.percentDone==1) {
                console.log(t.id + " is done")
                Blackbeard.get(t.id, (res) => {
                    // copy()
                    console.log(res.torrents[0].name)
                    copydir.sync('torrents/'+res.torrents[0].name, 'downloads/'+res.torrents[0].name, {
                      utimes: true,  // keep add time and modify time
                      mode: true,    // keep file mode
                      cover: true    // cover file when exists, default is true
                    })
                })
            }
        })
    })
})
