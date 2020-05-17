'use strict';

const Parser = require('rss-parser');
const fs = require('fs');
const cpx = require('cpx-fixed');
const path = require('path')
const parser = new Parser();
const Transmission = require('transmission-promise');
const transmission = new Transmission({
    port: 9091, // DEFAULT : 9091
    host: 'localhost' // DEAFULT : 127.0.0.1
});

var activeTorrents;

var download_dir = path.join(__dirname, 'torrents')

module.exports = {
    activeTorrents: activeTorrents,
    addUrl: function(url, title, cb) {
        transmission.add(url, {
            "download-dir": download_dir
        }).then(res => {
            res.title = title
            cb(res)
        })
    },
    getFeed: function() {
        (async () => {

            let feed = await parser.parseURL('http://showrss.info/user/20256.rss?magnets=true&namespaces=true&name=clean&quality=sd&re=null');
            console.log(feed.items.length + " feed items")
			transmission.get().then(allTorrents => {
            	feed.items.forEach(item => {
					// console.log(item)
                	item.mglnk = item.link.substring(20, 52).toUpperCase()
                	var trip = false;
					allTorrents.torrents.forEach((t) => {
	                    t.mglnk = t.magnetLink.substring(20, 52).toUpperCase()
	                    if (t.mglnk == item.mglnk) {
	                        trip = true;
	                    }
	                })
	                if (!trip) {
	                    this.addTorrent(item.link, function(res) {
	                        // console.log("Torrent added: " + item.title)
	                        // Get the file information first
	                        res.title = item.title
	                        var jsonContent = JSON.stringify(res);
							if (fs.existsSync("data/torrent." + res.hashString + ".json")) {
								//file exists
								// console.log("already exists")
								transmission.remove(res.id)
								console.log("Duplicate, not added: " + res.title)
							} else {
								fs.writeFile("data/torrent." + res.hashString + ".json", jsonContent, 'utf8', function(err) {
									if (err) {
										console.log("An error occured while writing JSON Object to File.");
										return console.log(err);
									}
									console.log("Torrent added: " + res.title);
								});
							}

	                    })
	                } else {
	                    console.log("Already downloading: " + item.title)
	                }
	            })
			})

        })();
    },
    addTorrent: function(url, cb) {
        transmission.add(url, {
            "download-dir": download_dir
        }).then(res => {
            cb(res)
        })
    },
    removeTorrent: function(id) {
        transmission.remove(id)
    },
    pauseTorrent: function(id) {
        transmission.stop(id)
    },
    startTorrent: function(id) {
        transmission.start(id)
    },
    startAll: function() {
        transmission.start().then(res => {
            console.log(this.activeTorrents.length + " torrents started.")
        })
    },
    pauseAll: function() {
        this.activeTorrents.forEach((t) => {
            this.pauseTorrent(t.id)
        })
        console.log(this.activeTorrents.length + " torrents paused.")
    },
    removeAll: function() {
        this.activeTorrents.forEach((t) => {
            this.removeTorrent(t.id)
        })
        console.log(this.activeTorrents.length + " torrents removed.")
    },
    getAllInfo: function(cb) {
        this.activeTorrents.forEach((t) => {
            transmission.get(t.id).then(res => {
                cb(res)
            })
        })
    },
    getTorrents: function(cb) {
        transmission.get().then(res => {
            cb(res)
        })
    },
    getAll: function(cb) {
        transmission.get().then(res => {
            module.exports.activeTorrents = []
            res.torrents.forEach((t) => {
                module.exports.activeTorrents.push(t)
            })
            cb()
        })
    },
    get: function(id, cb) {
        transmission.get(id).then(res => {
            cb(res)
        })
    },
    forceStart: function(id) {
        transmission.startNow(id).then(res => {
			console.log("force started " + id)
		})
    },
    sortTorrents: function() {
        var torStats = {
            incomplete: 0,
            complete: 0,
            copied: 0,
            stopped: 0,
            checkqueue: 0,
            checking: 0,
            downloadqueue: 0,
            downloading: 0,
            seedqueue: 0,
            seeding: 0,
            isolated: 0
        }
        transmission.get().then(res => {
            if (res.torrents.length != 0) {
                res.torrents.forEach((tor) => {
                    if (tor.percentDone == 1) {
                        torStats.complete++
                        fs.readFile('data/torrent.' + tor.hashString + '.json', 'utf8', (err, data) => {
                            if (err) throw err
                            var torstore = JSON.parse(data)
                            try {
								var torName = torstore.title//.replace("", "")
                                if (fs.existsSync('downloads/' + torName)) {
                                    //file exists
                                    // console.log("already exists")
									transmission.remove(tor.id)
									console.log("torrent removed")
                                } else {
                                    torStats.copied++
                                    console.log("copying file: " + tor.name)
                                    const { exec } = require("child_process");

                                    exec('cp -r torrents/"' + tor.name + '" downloads/"' + torName + '"', (error, stdout, stderr) => {
                                        if (error) {
                                            console.log(`error: ${error.message}`);
                                            return;
                                        }
                                        if (stderr) {
                                            console.log(`stderr: ${stderr}`);
                                            return;
                                        }
                                        console.log(`${stdout}`);
                                    });
                                }
                            } catch (err) {
                                console.error(err)
                            }
                        });
                    } else {
                        torStats.incomplete++
                    }
                    switch (tor.status) {
                        case 0:
                            // Torrent is stopped
                            torStats.stopped++
                            break
                        case 1:
                            // Queued to check files
                            torStats.checkqueue++
                            break
                        case 2:
                            // Checking files
                            torStats.checking++
                            break
                        case 3:
                            // Queued to download
                            torStats.downloadqueue++
                            break
                        case 4:
                            // Downloading
                            torStats.downloading++
                            break
                        case 5:
                            // Queued to seed
                            torStats.seedqueue++
                            break
                        case 6:
                            // Seeding
                            torStats.seeding++
                            break
                        case 7:
                            // Torrent can't find peers
                            torStats.isolated++
                            break
                    }
                })
                console.log(torStats)
            } else {
                console.log("No active torrents.")
            }
        })
    }
};
