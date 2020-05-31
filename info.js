let Blackbeard = require('./blackbeard')
let JsonDB = require('./json.db/json.db')
let AllShows = require('./scripts/all-shows')

// Shows.addShow("North Beach Coast Riot", 210, function(sho){ console.log("done") });
// Shows.removeShow(210, function(sho){ console.log("done") });

// var shows = new JsonDB("all-shows")

// shows.add({
//     name: "Fear The Walking Dead",
//     id: 45
// }, (shows)=>{
//     console.log(shows)
// })
//
// const as = new AllShows()
//

// as.refresh((_allShows) => {
//     as.getFullData((holes)=>{
//         console.log(holes)
//     })
// })
// Blackbeard.getFeed("http://showrss.info/user/20256.rss?magnets=true&namespaces=true&name=null&quality=null&re=null")
// console.log(Shows);

// Shows.shows((res_shows)=>{
//     console.log(res_shows)
// })

// require('./scripts/write-new-json')

// var args = process.argv.slice(2);
//
// if(args.length!=0) {
//     console.log(args)
// }
//
Blackbeard.getAll(function(){
    // Blackbeard.removeAll()
    Blackbeard.getAllInfo(function(res){
        res.torrents.forEach((t) => {
            var percentDone = parseFloat(Math.round(t.percentDone*10000)/100).toString().padStart(6)
            var timeLeft = parseFloat(Math.round(t.leftUntilDone/1000000/60)).toString().padStart(3)
            var status = t.status
            // console.log(t)
            // console.log((t))
            console.log(t.id+" [ "+percentDone+"% ] [ "+timeLeft+"m ] [ "+status+" ]\t"+t.name+"\t")
        })
    })
})
