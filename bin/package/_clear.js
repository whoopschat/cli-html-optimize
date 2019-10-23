const fs = require("fs");
const path = require("path");

function clear(dir) {
    var zipFile = path.join(dir, "package.zip");
    try {
        fs.unlinkSync(zipFile);
        fs.unlinkSync(zipFile + ".md5");
    } catch (error) {
    }
    return Promise.resolve();
}

module.exports = exports = {
    clear
}

