let JsonDB = require('../json.db/json.db')
const fs = require('fs');
const path = require('path');

var jsonObj = new JsonDB("shows")

function lg(msg) {
    console.log(msg)
}

function AllShows() {
    this.refresh = function(cb) {
        this.get(current_shows => {

            const puppeteer = require('puppeteer');

            (async () => {

                lg("Pinging https://showrss.info...")

                const browser = await puppeteer.launch({});
                const page = await browser.newPage();
                await page.goto('https://showrss.info/browse');

                const SHOWELEMENT = '#showselector > option'

                lg("Sorting results...")

                const selectOptions = await page.$$eval(SHOWELEMENT, el => {
                    return el.map(option => {
                        return {
                            name: option.textContent,
                            id: option.value
                        }
                    })
                })

                var saved = 0
                var found
                lg("Comparing...")
                selectOptions.forEach((res_show) => {
                    found = false
                    current_shows.list.forEach((cur_show) => {
                        if (cur_show.id == res_show.id) {
                            found = true
                        }
                    })
                    if (!found && res_show.id != "all") {
                        current_shows.list.push(res_show)
                        saved++
                        this.analyseShow(res_show.id)
                    }
                })
                lg("Save file:")

                var jsonContent = JSON.stringify(current_shows);
                fs.writeFile(path.join(__dirname, `/../json/objects/all-shows.json`), jsonContent, 'utf8', function(err) {
                    if (err) {
                        console.log("An error occured while writing JSON Object to File.");
                        return console.log(err);
                    }
                    console.log(`Saved ${saved} new tv shows.`)
                    cb(current_shows)
                });

                browser.close();

            })();

        })
    }
    this.get = function(cb) {
        jsonObj.get((shows) => {
            cb(shows)
        })
    }
    this.getShowById = function(id, cb) {
        jsonObj.get((shows) => {
            shows.forEach((show) => {
                if (show.id == id) {
                    cb(show)
                }
            })
        })
    }
    this.toggleSubscribed = function(id, cb) {

        this.get((shows) => {

            var updatedShow = false

            shows.list.forEach((show) => {
                if (parseInt(show.id) == parseInt(id)) {
                    if (show.subscribed == undefined) {
                        show.subscribed = true
                    } else {
                        show.subscribed = undefined
                    }
                    updatedShow = show
                }
            })

            var jsonContent = JSON.stringify(shows);
            fs.writeFile(path.join(__dirname, `/../json/objects/all-shows.json`), jsonContent, 'utf8', function(err) {
                if (err) {
                    console.log("An error occured while writing JSON Object to File.");
                    return console.log(err);
                }
                console.log(`Saved subscription data.`)
                cb(updatedShow)
            });

        })

    }
    this.returnDataHoles = function(cb) {
        this.get((shows) => {
            var holes = []
            shows.list.forEach((show) => {
                if (show.omdb == undefined) {
                    holes.push(show)
                } else {
                    if(show.omdb.Response=="False") {
                        holes.push(show)
                    }
                }
            })
            cb(holes)
        })
    }
    this.getFullData = function(cb) {
        this.get((shows) => {
            var extended = []
            shows.list.forEach((show) => {
                if (show.omdb != undefined) {
                    extended.push(show)
                }
            })
            cb(extended)
        })
    }
    this.analyseShow = function(id, cb=()=>{}) {
        this.get((shows) => {
            var idShow = false
            shows.list.forEach((show) => {
                if (show.id == id) {
                    if(show.lastAnalysed==undefined || Date.now()-parseInt(show.lastAnalysed)>50000) {
                        show.lastAnalysed = Date.now()
                        idShow = show
                        jsonObj.save(shows)
                    }
                }
            })
            if(idShow) {
                if(idShow.omdb!=undefined) {
                    if(idShow.omdb.Response!="False" && idShow.omdb.Response!="not-found") {

                        if(idShow.omdb.Actors!=undefined) {
                            var actors = idShow.omdb.Actors.split(",");
                            actors.forEach((ac)=>{ ac = ac.trim() })

                            var found
                            var _actorsObj = new JsonDB("actors")
                            _actorsObj.get((_actors)=>{
                                actors.forEach((actor)=>{
                                    found = false
                                    _actors.list.forEach((_actor)=>{
                                        if(_actor.name == actor.trim()) {
                                            //found
                                            found = true
                                            if(!_actor.shows.includes(id)) {
                                                _actor.shows.push(parseInt(id))
                                            }
                                        }
                                    })
                                    if(!found) {
                                        _actors.list.push({
                                            name: actor.trim(),
                                            shows: [parseInt(id)]
                                        })
                                    }
                                })
                                _actorsObj.save(_actors)
                            })

                        }
                        console.log(actors)

                        if(idShow.omdb.Genre!=undefined) {
                            var genres = idShow.omdb.Genre.split(",");
                            genres.forEach((genre)=>{ genre = genre.trim() })

                            var found
                            var _genresObj = new JsonDB("genres")
                            _genresObj.get((_genres)=>{
                                genres.forEach((genre)=>{
                                    found = false
                                    _genres.list.forEach((_genre)=>{
                                        if(_genre.name == genre.trim()) {
                                            //found
                                            found = true
                                            if(!_genre.shows.includes(id)) {
                                                _genre.shows.push(parseInt(id))
                                            }
                                        }
                                    })
                                    if(!found) {
                                        _genres.list.push({
                                            name: genre.trim(),
                                            shows: [parseInt(id)]
                                        })
                                    }
                                })
                                _genresObj.save(_genres)
                            })
                        }
                        // console.log(genres)

                        if(idShow.omdb.Director!=undefined) {
                            var directors = idShow.omdb.Director.split(",");
                            directors.forEach((director)=>{ director = director.trim() })
                            // console.log(directors)

                            var found
                            var _directorsObj = new JsonDB("directors")
                            _directorsObj.get((_directors)=>{
                                directors.forEach((director)=>{
                                    found = false
                                    _directors.list.forEach((_director)=>{
                                        if(_director.name == director.trim()) {
                                            //found
                                            found = true
                                            if(!_director.shows.includes(id)) {
                                                _director.shows.push(parseInt(id))
                                            }
                                        }
                                    })
                                    if(!found) {
                                        _directors.list.push({
                                            name: director.trim(),
                                            shows: [parseInt(id)]
                                        })
                                    }
                                })
                                _directorsObj.save(_directors)
                            })
                        }

                        if(idShow.omdb.Writer!=undefined) {
                            var writers = idShow.omdb.Writer.split(",");
                            writers.forEach((writer)=>{ writer = writer.trim() })
                            // console.log(writers)

                            var found
                            var _writersObj = new JsonDB("writers")
                            _writersObj.get((_writers)=>{
                                writers.forEach((writer)=>{
                                    found = false
                                    _writers.list.forEach((_writer)=>{
                                        if(_writer.name == writer.trim()) {
                                            //found
                                            found = true
                                            if(!_writer.shows.includes(id)) {
                                                _writer.shows.push(parseInt(id))
                                            }
                                        }
                                    })
                                    if(!found) {
                                        _writers.list.push({
                                            name: writer.trim(),
                                            shows: [parseInt(id)]
                                        })
                                    }
                                })
                                _writersObj.save(_writers)
                            })
                        }

                    }
                }
                cb(idShow)
            }
        })
    }
    this.extendDataFile = function(cb=()=>{}) {
        const https = require('https');
        this.returnDataHoles((holes) => {
            // api requests
            if(holes.length!==0) {
                var hole = holes[0]
                var searchTerm = hole.name.replace(/ /g, "+").replace(/\([A-Z0-9]+\)/g, "")
                // holes.forEach((hole) => {
                var req_url = `https://www.omdbapi.com/?apikey=a95bfa3f&t=${searchTerm}&type=series&plot=full&r=json`
                lg(req_url)
                https.get(req_url, (resp) => {
                    let data = '';

                    // A chunk of data has been recieved.
                    resp.on('data', (chunk) => {
                        data += chunk;
                    });

                    // The whole response has been received. Print out the result.
                    resp.on('end', () => {
                        var showData = false
                        if (resp.statusCode === 200) {
                            try {
                                showData = JSON.parse(data)
                                if(showData.Response=="False") {
                                    showData.Response="not-found"
                                }
                            } catch (e) {
                                console.log('Error parsing JSON!');
                            }
                        } else {
                            console.log('Status:', resp.statusCode);
                        }

                        this.get((shows) => {

                            var updatedShow = false

                            shows.list.forEach((show) => {
                                if (show.id == hole.id) {
                                    show.omdb = showData
                                    updatedShow = show
                                }
                            })

                            var jsonContent = JSON.stringify(shows);
                            fs.writeFile(path.join(__dirname, `/../json/objects/all-shows.json`), jsonContent, 'utf8', function(err) {
                                if (err) {
                                    console.log("An error occured while writing JSON Object to File.");
                                    return console.log(err);
                                }
                                console.log(`Saved OMDB data.`)
                                cb(updatedShow)
                            });

                        })

                    });

                }).on("error", (err) => {
                    console.log("Error: " + err.message);
                });
                // })
            }
        })
    }
}

module.exports = AllShows
