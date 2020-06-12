module.exports = function() {
    this.lg = (msg) => {
        console.log(`//BB> ${msg}`)
    }
    this.sleep = async (millis) => {
        console.log("sleeping...")
        return new Promise(resolve => setTimeout(resolve, millis));
    }
    this.path = require('path')
    this.fs = require('fs')
    this.port = process.env.PORT || 4000;
    this.FetchStathamEntities = ["shows", "actors", "writers", "directors", "genres"];
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
