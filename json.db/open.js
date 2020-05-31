const fs = require('fs');
const path = require('path');

module.exports = function(obj) {
    var data = fs.readFileSync(path.join(__dirname , `/../json/objects/${obj}.json`), {
        encoding: 'utf8',
        flag: 'r'
    });
    return JSON.parse(data)
}
