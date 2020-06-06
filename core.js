const { lg, sleep } = require('./scripts/core-functions')

module.exports = function() {
    this.lg = function(arg) { return lg(arg) }
    this.sleep = async function(arg) { return await sleep(arg) }
    this.path = require('path')
    this.fs = require('fs')
    this.port = process.env.PORT || 4000;
    this.FetchStathamEntities = ["genres", "shows", "writers", "directors", "actors"];
    this.cl_input = function(cmd, cb) {
        const { exec } = require("child_process");
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                lg(`error: ${error.message}`)
                return
            }
            if (stderr) {
                lg(`stderr: ${stderr}`)
                return
            }
            lg(`${stdout}`);
            cb(stdout)
        })
    }
}
