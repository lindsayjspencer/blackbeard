#!/usr/bin/env node

require('./core')()

let Moment = require('moment')
let Blackbeard = require('./blackbeard')
const { Bb } = require('./bb')
let AllShows = require('./scripts/all-shows')

let JsonDB = require('./json.db/json.db')
let Statham = require('./json.db/statham')

class SocketRoutes {

    // construct Statham object
    // open json object files and assign to data object
    constructor(io) {

        this.db = new Statham(["genres", "all-shows", "writers", "directors", "actors"], io)

        this.io = io

    }

    init() {
        var obj = this

        this.webSocket = this.io.of('/web').on('connection', function(socket) {

            // connection
            lg(`New connection: web client`);

            // database service
            socket.on('utility_function', function(msg) {

                obj.entity_info()
                lg(obj.read("genres", 20))
                lg(`Statham response`)
                socket.emit('msg', `jSON.db is on.`)

            })

            // web service
            socket.on('bb.stop-all', function() {
                Bb.stopAll()
                socket.emit('msg', 'All torrents stopped.')
            });
            socket.on('bb.start-all', function() {
                Bb.startAll()
                socket.emit('msg', 'All torrents started.')
            });
            socket.on('bb.remove-all', function() {
                Bb.removeAll()
                socket.emit('msg', 'All torrents removed.')
            });
            socket.on('bb.get', function(msg) {
                // get info
                Bb.get((res) => {
                    var msg = {
                        torrents: []
                    }
                    var _tor
                    res.torrents.forEach((tor) => {
                        _tor = {
                            id: tor.id,
                            leftUntilDone: tor.leftUntilDone,
                            status: tor.status,
                            rateDownload: tor.rateDownload,
                            percentDone: tor.percentDone
                        }
                        msg.torrents.push(_tor)
                    })
                    socket.emit('bb.get', msg);
                })
            });
            socket.on('bb.get-info', function(msg) {
                // get info
                Bb.get((res) => {
                    // lg(res.torrents)
                    var msg = {
                        torrents: []
                    }
                    var _tor
                    res.torrents.forEach((tor) => {
                        fs.readFile('data/torrent.' + tor.hashString + '.json', 'utf8', (err, data) => {
                            // if (err) throw err
                            var torstore = JSON.parse(data)
                            try {
                                var torName
                                if (torstore.title == '.') {
                                    torName = tor.name
                                } else {
                                    torName = torstore.title //.replace("", "")
                                }
                                _tor = {
                                    name: torName,
                                    id: tor.id,
                                    leftUntilDone: tor.leftUntilDone,
                                    status: tor.status,
                                    rateDownload: tor.rateDownload,
                                    percentDone: tor.percentDone,
                                    lastUpdated: Date.now()
                                }
                                socket.emit('bb.get-info', _tor);
                            } catch (err) {
                                console.error(err)
                            }
                        });
                    })
                })
            });
            socket.on('disconnect', function() {
                lg('Disconnection: web client');
            });
            socket.on('bb.sort', function() {
                Bb.sort()
                socket.emit('msg', 'Sorted torrents.')
            });
            socket.on('bb.restart-daemon', function() {
                const { exec } = require("child_process");
                exec('sudo bash save-settings.sh', (error, stdout, stderr) => {
                    if (error) {
                        lg(`error: ${error.message}`)
                        return
                    }
                    if (stderr) {
                        lg(`stderr: ${stderr}`)
                        return
                    }
                    lg(`${stdout}`);
                    socket.emit('msg', 'Transmission daemon restarted.')
                })
            });
            socket.on('add_magnet', function(magnetLink) {
                // lg(magnetLink)
                Blackbeard.addTorrent(magnetLink, function(res) {
                    res.title = "."
                    lg(res)
                    var jsonContent = JSON.stringify(res);
                    fs.writeFile("data/torrent." + res.hashString + ".json", jsonContent, 'utf8', function(err) {
                        if (err) {
                            lg("An error occured while writing JSON Object to File.");
                            return lg(err);
                        }
                        lg("JSON file has been saved.");
                    });
                    socket.emit('msg', 'magnet added: ' + res.name)
                })
            });
            socket.on('add_rss', function(name, url) {
                // lg(magnetLink)
                RSSFeeds.addFeed(name, url, function(res) {
                    socket.emit('msg', 'RSS feed added: ' + name)
                })
            });
            socket.on('ping_rss', function() {
                Blackbeard.getFeed()
                socket.emit('msg', 'feed pinged')
            });
            socket.on('get_feeds', function() {
                RSSFeeds.feeds((_feeds) => {
                    socket.emit('send_rss_feeds', _feeds)
                })
            });
            socket.on('subscribe_toggle', function(id) {

                let as = new AllShows()

                as.toggleSubscribed(id, (toggled) => {
                    socket.emit('msg', 'Subscribed')
                    socket.emit('subscribe_toggle', 'Subscribed')
                })

            });
            socket.on('get_rss_feed', function(id) {

                var url = `https://showrss.info/show/${parseInt(id)}.rss`

                Blackbeard.pingFeed(url, (feed) => {
                    socket.emit('get_rss_feed', feed)
                    lg("Feed received and sent to web client.")
                })

            });

        })
    }

}

module.exports = SocketRoutes
