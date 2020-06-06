const fs = require('fs');
const path = require('path');

module.exports = function(obj) {
    var data = fs.readFileSync(path.join(__dirname , `/entities/${obj}.json`), {
        encoding: 'utf8',
        flag: 'r'
    });
    return JSON.parse(data)
}
