#!/usr/bin/env node
require('../core')()

let Moment = require('moment')
const { BlackbeardTransmission } = require('../blackbeard/blackbeard.transmission')

const { StathamDb } = require('../statham.db/statham.db')
let Statham = new StathamDb(FetchStathamEntities)

let ShowController = require('../controllers/shows.controller')
const Shows = new ShowController(Statham)

var Socket;

class SocketRoutes {

    // construct Statham object
    // open json object files and assign to data object
    constructor(io) {

        Socket = io

    }

    init() {

        this.webSocket = Socket.of('/web').on('connection', function(socket) {

            // connection
            lg(`New connection: web client`);

            // database service
            socket.on('Blackbeard.utility-function', function(msg) {

                // let ActorsDb = Statham.get("actors")
                console.log(Statham.read("actors", [1,2,3]))
                socket.emit('msg', `StathamDb is on.`)

            })

            // web service
            socket.on('BlackbeardTransmission.stop', function(id) {

                BlackbeardTransmission.stop(parseInt(id))
                socket.emit('msg', 'Torrent stopped.')

            });
            socket.on('BlackbeardTransmission.start', function(id) {

                BlackbeardTransmission.start(parseInt(id))
                socket.emit('msg', 'Torrent started.')

            });
            socket.on('BlackbeardTransmission.stop-all', function() {

                BlackbeardTransmission.stopAll()
                socket.emit('msg', 'All torrents stopped.')

            });
            socket.on('BlackbeardTransmission.start-all', function() {

                BlackbeardTransmission.startAll()
                socket.emit('msg', 'All torrents started.')

            });
            socket.on('BlackbeardTransmission.remove-all', function() {

                BlackbeardTransmission.removeAll()
                socket.emit('msg', 'All torrents removed.')

            });
            socket.on('BlackbeardTransmission.get', function() {

                // get active torrents info
                BlackbeardTransmission.get((msg) => {
                    socket.emit('BlackbeardTransmission.get', msg);
                })

            });
            socket.on('BlackbeardTransmission.get-info', function(msg) {

                // get detailed active torrents info
                BlackbeardTransmission.getInfo((res)=>{
                    socket.emit('BlackbeardTransmission.get-info', res)
                })

            });
            socket.on('disconnect', function() {

                lg('Disconnection: web client');

            });
            socket.on('BlackbeardTransmission.sort', function() {

                BlackbeardTransmission.sort()
                socket.emit('msg', 'Sorted torrents.')

            });
            socket.on('BlackbeardTransmission.restart-daemon', function() {

                cl_input('sudo bash scripts/save-settings.sh', (res) => {
                    socket.emit('msg', 'Transmission daemon restarted.')
                })

            });
            socket.on('BlackbeardTransmission.add-magnet', async function(data) {

                console.log(data.showData)
                var res = await BlackbeardTransmission.addTorrent(data.magnetLink, data.showData)
                socket.emit('msg', 'magnet added: ' + res.name)

            });
            socket.on('Shows.getAllShows', function() {

                socket.emit('msg', 'All shows loaded.')
                socket.emit('Shows.getAllShows', Shows.getAllShows())

            });
            socket.on('Shows.toggleSubscribed', function(id) {

                var subscribed = Shows.toggleSubscribed(id)

                socket.emit('msg', `${subscribed ? 'S' : 'Uns'}ubscribed`)
                socket.emit('Shows.toggleSubscribed', {id:id, subscribed:subscribed})


            });
            socket.on('BlackbeardTransmission.get-rss-feed', function(id) {

                var url = `https://showrss.info/show/${parseInt(id)}.rss`

                BlackbeardTransmission.pullFeed(url).then((feed) => {
                    feed.id = id
                    socket.emit('BlackbeardTransmission.get-rss-feed', feed)
                    lg("Feed received and sent to web client.")
                })

            });

        })
    }

}

module.exports = SocketRoutes
