const { lg, sleep } = require('./scripts/core-functions')

module.exports = function() {
    this.lg = function(arg) { return lg(arg) }
    this.sleep = async function(arg) { return await sleep(arg) }
    this.path = require('path')
    this.fs = require('fs')
    this.port = process.env.PORT || 4000;
}
