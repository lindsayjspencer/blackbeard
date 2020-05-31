const fs = require('fs');
const path = require('path');

// console.log(path.join(__dirname , '/../lib/feeds.json'))

module.exports = function(cb) {
    fs.readFile(path.join(__dirname , '/../lib/shows.json'), 'utf8', (err, data) => {
        try {
            var getShows = JSON.parse(data)
            cb(getShows)
        } catch (err) {
            console.log(err)
            console.log("Error loading shows config")
        }
    });
}
