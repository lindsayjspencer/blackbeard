const fs = require('fs');
const path = require('path');

module.exports = function(obj, cb) {
    fs.readFile(path.join(__dirname , `/../json/objects/${obj}.json`), 'utf8', (err, data) => {
        try {
            var getObj = JSON.parse(data)
            cb(getObj)
        } catch (err) {
            console.log(err)
            console.log(`Error loading ${obj} store`)
        }
    });
}
