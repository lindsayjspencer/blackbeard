#!/usr/bin/env node
require('../core')()

const { BlackbeardTransmission } = require('../blackbeard/blackbeard.transmission')

const { StathamDb } = require('../statham.db/statham.db')
let Statham = new StathamDb(FetchStathamEntities)

let ShowController = require('../controllers/shows.controller')
const Shows = new ShowController(Statham)

var Socket;

class SocketRoutes {

    // ---------------------------------------------------------- //
    // Construct SocketRoutes class
    // ---------------------------------------------------------- //

    constructor(io) {

        Socket = io

    }

    // ---------------------------------------------------------- //
    // Initialise main code block
    // ---------------------------------------------------------- //

    init() {

        this.webSocket = Socket.of('/web').on('connection', function(socket) {

            // > connection
            lg(`New connection: web client`);
            // ---> Log socket disconnection
            socket.on('disconnect', function() {
                lg('Disconnection: web client');
            });

            // > Utility button for testing
            socket.on('Blackbeard.utility-function', function(msg) {
                console.log(Statham.read("actors", [1,2,3]))
                socket.emit('msg', `StathamDb is on`)
            })

    // ---------------------------------------------------------- //
    // BlackbeardTransmission
    // -- (blackbeard/blackbeard.transmission.js)
    // -- Websocket integration
    // ---------------------------------------------------------- //

        //
        // > Individual torrent control

            // ---> Stop a torrent by transmission ID

                socket.on('BlackbeardTransmission.stop', function(id) {
                    BlackbeardTransmission.stop(parseInt(id))
                    socket.emit('msg', 'Torrent stopped')
                });

            // <---
            // ---> Start a torrent by transmission ID

                socket.on('BlackbeardTransmission.start', function(id) {
                    BlackbeardTransmission.start(parseInt(id))
                    socket.emit('msg', 'Torrent started')
                });

            // <---
            // ---> Add a torrent by magnet link (optional: show data)

                socket.on('BlackbeardTransmission.add-magnet', async function(data) {
                    var res = await BlackbeardTransmission.addTorrent(data.magnetLink, data.showData)
                    socket.emit('msg', 'magnet added: ' + res.name)
                });


            // <---

        //

        //
        // > Control all torrents

            // ---> Stop all torrents

                socket.on('BlackbeardTransmission.stop-all', function() {
                    BlackbeardTransmission.stopAll()
                    socket.emit('msg', 'All torrents stopped')
                });

            // <---
            // ---> Start all torrents

                socket.on('BlackbeardTransmission.start-all', function() {
                    BlackbeardTransmission.startAll()
                    socket.emit('msg', 'All torrents started')
                });

            // <---
            // ---> Remove all torrents

                socket.on('BlackbeardTransmission.remove-all', function() {
                    BlackbeardTransmission.removeAll()
                    socket.emit('msg', 'All torrents removed')
                });

            // <---
            // ---> Get all active torrents transmission metadata (condensed)

                socket.on('BlackbeardTransmission.get', function() {
                    BlackbeardTransmission.get((msg) => {
                        socket.emit('BlackbeardTransmission.get', msg);
                    })
                });

            // <---
            // ---> Get all active torrents transmission metadata (full)

                socket.on('BlackbeardTransmission.get-info', function(msg) {
                    BlackbeardTransmission.getInfo((res)=>{
                        socket.emit('BlackbeardTransmission.get-info', res)
                    })
                });

            // <---
            // ---> Sort active torrents, copy and remove completed

                socket.on('BlackbeardTransmission.sort', function() {
                    socket.emit('msg', 'Analysing torrents')
                    BlackbeardTransmission.sort((res) => {
                        socket.emit('msg', res)
                    })
                });

            // <---
            // ---> Restart transmission daemon

                socket.on('BlackbeardTransmission.restart-daemon', function() {
                    BlackbeardTransmission.restartDaemon((res) => {
                        socket.emit('msg', 'Transmission daemon restarted')
                    })
                });

            // <---

        //

    // ---////

    // ---------------------------------------------------------- //
    // Shows (ShowsController)
    // -- (controllers/shows.controller.js)
    // -- Websocket integration
    // ---------------------------------------------------------- //

        //
        // > Control objects within the Shows entity

            // ---> Get all shows

                socket.on('Shows.getAllShows', function() {
                    socket.emit('msg', 'All shows loaded')
                    socket.emit('Shows.getAllShows', Shows.getAllShows())
                });

            // <---
            // ---> Toggle show subscribed

                socket.on('Shows.toggleSubscribed', function(id) {
                    var subscribed = Shows.toggleSubscribed(id)
                    socket.emit('msg', `${subscribed ? 'S' : 'Uns'}ubscribed`)
                    socket.emit('Shows.toggleSubscribed', {id:id, subscribed:subscribed})
                });

            // <---
            // ---> Pull RSS feed from showRSS

                socket.on('Shows.get-rss-feed', function(id) {
                    var url = `https://showrss.info/show/${parseInt(id)}.rss`
                    Shows.pullFeed(url).then((feed) => {
                        feed.id = id
                        socket.emit('msg', 'Feed fetched')
                        setTimeout(()=>{ socket.emit('msg', `${feed.items.length} items`); }, 250);
                        socket.emit('Shows.get-rss-feed', feed)
                        lg("Feed received and sent to web client.")
                    })
                });

            // <---

        //


    // ---////

        })
    }

}

module.exports = SocketRoutes
