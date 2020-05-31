const fs = require('fs');
const path = require('path');

module.exports = function(obj, data) {
    fs.writeFileSync(path.join(__dirname , `/../json/objects/${obj}.json`), JSON.stringify(data), {
        encoding: 'utf8'
    });
}
