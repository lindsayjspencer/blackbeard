const fs = require('fs');
const path = require('path');

module.exports = function(obj, data) {
    return fs.writeFileSync(path.join(__dirname , `/entities/${obj}.json`), JSON.stringify(data), {
        encoding: 'utf8'
    });
}
