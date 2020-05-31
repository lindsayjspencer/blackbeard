const fs = require('fs');
const path = require('path');

// console.log(path.join(__dirname , '/../lib/feeds.json'))

module.exports = function(cb) {
    fs.readFile(path.join(__dirname , '/../json/feeds.json'), 'utf8', (err, data) => {
        try {
            var getFeeds = JSON.parse(data)
            cb(getFeeds)
        } catch (err) {
            console.log(err)
            console.log("Error loading feeds config")
        }
    });
}
