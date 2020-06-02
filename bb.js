require('./core')()

const Parser = require('rss-parser');
const parser = new Parser();
const Transmission = require('transmission-promise');
const transmission = new Transmission({
    port: 9091, // DEFAULT : 9091
    host: 'localhost' // DEAFULT : 127.0.0.1
});

class Blackbeard {

    constructor() {

        this.downloadDir = path.join(__dirname, 'incomplete')

    }

    async pullFeed(url) {

        return await parser.parseURL(url);

    }

    get(cb) {
        transmission.get().then(res => {
            cb(res)
        })
    }

    removeAll() {
        transmission.get().then(res => {
            res.torrents.forEach((t) => {
                transmission.remove(t.id)
            })
        })
    }

    stopAll() {
        transmission.get().then(res => {
            res.torrents.forEach((t) => {
                transmission.stop(t.id)
            })
        })
    }

    startAll() {
        transmission.start()
    }

    remove(id) {
        transmission.remove(id)
    }

    stop(id) {
        transmission.stop(id)
    }

    start(id) {
        transmission.start(id)
    }

    sort() {
        transmission.get().then(res => {
            res.torrents.forEach((tor) => {
                // clear completed
                if (tor.percentDone == 1) {
                    fs.readFile('data/torrent.' + tor.hashString + '.json', 'utf8', (err, data) => {
                        if (!err) {
                            var torstore = JSON.parse(data)
                            try {
                                var torName
                                if (torstore.title == '.') {
                                    torName = tor.name
                                } else {
                                    torName = torstore.title //.replace("", "")
                                }
                                if (fs.existsSync('downloads/' + torName)) {
                                    //file exists
                                    // lg("already exists")
                                    transmission.remove(tor.id)
                                    lg("torrent removed")
                                } else {
                                    lg("copying file: " + tor.name)
                                    const { exec } = require("child_process");
                                    exec('cp -r incomplete/"' + tor.name + '" downloads/"' + torName + '"', (error, stdout, stderr) => {
                                        if (error) {
                                            lg(`error: ${error.message}`);
                                            return;
                                        }
                                        if (stderr) {
                                            lg(`stderr: ${stderr}`);
                                            return;
                                        }
                                        lg(`${stdout}`);
                                    });
                                }
                            } catch (err) {
                                console.error(err)
                            }
                        } else {
                            lg("file error")
                        }
                    });
                }
            })
        })
    }

}

exports.Bb = new Blackbeard()
