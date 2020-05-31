exports.sleep = (millis) => {
    console.log("sleeping...")
    return new Promise(resolve => setTimeout(resolve, millis));
}

exports.lg = (msg) => {
    console.log(`//BB> ${msg}`)
}
