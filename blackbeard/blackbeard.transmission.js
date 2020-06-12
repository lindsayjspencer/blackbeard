#!/usr/bin/env node
require('../core')()

const Transmission = require('transmission-promise');
const transmission = new Transmission({
    port: 9091, // DEFAULT : 9091
    host: 'localhost' // DEAFULT : 127.0.0.1
});

class BlackbeardTransmission {

    constructor() {

        this.incompleteDir = path.join(__dirname, 'incomplete')
        this.downloadDir = path.join(__dirname, 'downloads')
        this.dataDir = path.join(__dirname, 'data')

    }

    restartDaemon(cb) {
        cl_input('sudo bash scripts/save-settings.sh', (res) => {
            cb(res)
        })
    }

    async addTorrent(url, data=null) {

        let incompleteDir = this.incompleteDir
        let dataDir = this.dataDir

        return await transmission.add(url, {
            "download-dir": this.incompleteDir
        }).then(res => {
            res.title = "."
            if(data) {
                res.data = data
            }
            lg(res)
            var jsonContent = JSON.stringify(res);
            fs.writeFile(`${dataDir}/torrent.${res.hashString}.json`, jsonContent, 'utf8', function(err) {
                if (err) {
                    lg("An error occured while writing JSON Object to File.");
                    return lg(err);
                }
                lg("JSON file has been saved.");
            });
            return res
        })

    }

    get(cb) {
        transmission.get().then(res => {
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
            cb(msg)
        })
    }

    async getInfo(cb) {
        let dataDir = this.dataDir
        await transmission.get().then(res => {
            // lg(res.torrents)
            var msg = {
                torrents: []
            }
            var _tor
            var response = []
            res.torrents.forEach((tor) => {
                const data = fs.readFileSync(`${dataDir}/torrent.${tor.hashString}.json`, {
                    encoding: 'utf8',
                    flag: 'r'
                })
                // if (err) throw err
                var torstore = JSON.parse(data)
                var torName
                if (torstore.title == '.') {
                    torName = tor.name
                } else {
                    torName = torstore.title //.replace("", "")
                }
                let showData = false
                if(torstore.data!=undefined) {
                    showData = {
                        id: parseInt(torstore.data.id)
                    }
                }
                _tor = {
                    name: torName,
                    data: showData,
                    id: tor.id,
                    leftUntilDone: tor.leftUntilDone,
                    status: tor.status,
                    rateDownload: tor.rateDownload,
                    percentDone: tor.percentDone,
                    lastUpdated: Date.now()
                }
                response.push(_tor)
            })
            cb(response)
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

    sort(cb) {
        let dataDir = this.dataDir
        let downloadDir = this.downloadDir
        let removed = 0
        let copied = 0
        transmission.get().then(res => {
            let sortRequired = res.torrents.filter(x=>x.percentDone==1).length
            if(sortRequired==0) { setTimeout(()=>{ cb(`Sorting not required`); }, 250); return; }
            cb(`${sortRequired} completed torrents to sort`)
            res.torrents.forEach((tor) => {
                // clear completed
                if (tor.percentDone == 1) {
                    const data = fs.readFileSync(`${dataDir}/torrent.${tor.hashString}.json`, {
                        encoding: 'utf8',
                        flag: 'r'
                    })
                    cb(`Reading tor file`)
                    var torstore = JSON.parse(data)
                    try {
                        var torName
                        if (torstore.title == '.') {
                            torName = tor.name
                        } else {
                            torName = torstore.title //.replace("", "")
                        }
                        if (fs.existsSync(`${downloadDir}/${torName}`)) {
                            //file exists
                            transmission.remove(tor.id)
                            lg("torrent removed")
                            removed++
                            // lg("already exists")
                            cb(`Removed ${torName}, file already exists.`)
                        } else {
                            lg("copying file: " + tor.name)
                            const {
                                exec
                            } = require("child_process");
                            exec('cp -r blackbeard/incomplete/"' + tor.name + '" blackbeard/downloads/"' + torName + '"', (error, stdout, stderr) => {
                                if (error) {
                                    lg(`error: ${error.message}`);
                                    return;
                                }
                                if (stderr) {
                                    lg(`stderr: ${stderr}`);
                                    return;
                                }
                                lg(`${stdout}`);
                                transmission.remove(tor.id)
                                lg("torrent removed")
                                cb(`Removed and copied ${torName} to downloads.`)
                            });
                        }
                    } catch (err) {
                        console.error(err)
                        cb(`Error reading tor file`)
                    }
                }
            })
        })
    }

}

exports.BlackbeardTransmission = new BlackbeardTransmission()
