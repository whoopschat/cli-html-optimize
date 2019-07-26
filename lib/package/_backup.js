const fs = require("fs");
const path = require('path');
const crypto = require('crypto');

function digest(data) {
    return crypto.createHash('md5').update(data).digest('hex');
}

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
    return htmls;
}

function folder(file) {
    try {
        var sep = path.sep
        var folders = path.dirname(file).split(sep);
        var p = '';
        while (folders.length) {
            p += folders.shift() + sep;
            if (!fs.existsSync(p)) {
                fs.mkdirSync(p);
            }
        }
    } catch (error) {
    }
}

function build(file, dir) {
    let backup = path.join(dir, ".backup", digest(file));
    folder(backup);
    let html = fs.existsSync(backup) ? fs.readFileSync(backup, 'utf8') : fs.readFileSync(file, 'utf8');
    fs.writeFileSync(backup, html);
    fs.writeFileSync(`${file}`, html);
}

function backup(dir) {
    return new Promise((resolve, reject) => {
        try {
            scan(dir).forEach((file) => {
                build(file, dir);
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = exports = {
    backup
}