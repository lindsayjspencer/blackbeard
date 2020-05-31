const ChromecastAPI = require('chromecast-api')

const media = {
    url: 'http://http://172.16.11.244:4000/play',
}

const client = new ChromecastAPI()

client.on('device', function(device) {
    if (device.friendlyName == "Living Room TV") {
        device.play(media, function(err) {
            if (!err) {
                console.log('Playing in your chromecast ' + device.friendlyName)
            }
        })
    }
})
