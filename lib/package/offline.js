const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

function scan(srcPath) {
    let htmls = [];
    const scanDir = (nextPath) => {
        const files = fs.readdirSync(nextPath);
        if (!files.length) {
            return;
        }
        files.forEach(file => {
            let absFile = path.join(nextPath, `./${file}`);
            let fileStat = fs.statSync(absFile);
            if (fileStat.isDirectory()) {
                return scanDir(absFile);
            }
            if (/\.html$/.test(file) && fileStat.isFile()) {
                htmls.push(absFile);
            }
        });
    }
    scanDir(srcPath);

    return htmls.map(item => path.relative(srcPath, item).split('\\').join('/'));
}

function unlink(file) {
    try {
        fs.unlinkSync(file);
    } catch (error) {
    }
}

function offline(dir, info = {}) {
    let jsonFile = path.join(dir, 'offline-package.json');
    unlink(jsonFile);
    info.htmls = scan(dir);
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