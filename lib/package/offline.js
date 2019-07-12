const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const crypto = require('crypto');

function md5(data) {
    return crypto.createHash('md5').update(data).digest('hex');
}

function unlink(file) {
    try {
        fs.unlinkSync(file);
    } catch (error) {
    }
}

function offline(dir, info) {
    let jsonFile = path.join(dir, 'offline-package.json');
    unlink(jsonFile);
    fs.writeFileSync(jsonFile, JSON.stringify(info || {}, null, 2));
    let zipFile = path.join(dir, 'offline-package.zip');
    unlink(zipFile);
    let archive = archiver('zip');
    archive.directory(dir, false);
    let output = fs.createWriteStream(zipFile);
    archive.pipe(output);
    return archive.finalize().then(() => {
        return zipFile;
    });
}

module.exports = exports = {
    offline
}