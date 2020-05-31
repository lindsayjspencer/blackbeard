const path = require('path');
const feeds = require('./open-feeds-file');
const fs = require('fs');

module.exports = {
    feeds: feeds,
    addFeed: function(name, url, cb) {
        feeds((res_feeds) => {
            res_feeds.feeds.push({
                name: name,
                url: url
            })
            var jsonContent = JSON.stringify(res_feeds);
            fs.writeFile(path.join(__dirname , '/../json/feeds.json'), jsonContent, 'utf8', function(err) {
                if (err) {
                    console.log("An error occured while writing JSON Object to File.");
                    return console.log(err);
                }
                console.log("RSS feed added: " + name)
                cb(res_feeds)
            });
        })
    },
}
