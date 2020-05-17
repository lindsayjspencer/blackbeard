let Blackbeard = require('./blackbeard')

var args = process.argv.slice(2);

if(args.length!=0) {
    console.log(args)
}

Blackbeard.getAll(function(){
    Blackbeard.getAllInfo(function(res){
        res.torrents.forEach((t) => {
            var percentDone = parseFloat(Math.round(t.percentDone*10000)/100).toString().padStart(6)
            var timeLeft = parseFloat(Math.round(t.leftUntilDone/1000000/60)).toString().padStart(3)
            var status = t.status
            // console.log((t))
            console.log(t.id+" [ "+percentDone+"% ] [ "+timeLeft+"m ] [ "+status+" ]\t"+t.name+"\t")
        })
    })
})
