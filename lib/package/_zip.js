const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

function clear(zipFile) {
    try {
        fs.unlinkSync(zipFile);
        fs.unlinkSync(zipFile + ".md5");
    } catch (error) {
    }
}

function zip(dir) {
    var zipFile = path.join(dir, "package.zip");
    clear(zipFile);
    var archive = archiver("zip");
    archive.directory(dir, false);
    var output = fs.createWriteStream(zipFile);
    archive.pipe(output);
    return archive.finalize().then(function () {
        return zipFile;
    });
}

module.exports = exports = {
    zip
}