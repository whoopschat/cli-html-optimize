const fs = require("fs");
const path = require('path');

function build(file) {
    let backup = `${file}.backup`;
    let html = fs.existsSync(backup) ? fs.readFileSync(backup, 'utf8') : fs.readFileSync(file, 'utf8');
    fs.writeFileSync(backup, html);
    fs.writeFileSync(`${file}`, html);
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

function backup(dir) {
    return new Promise((resolve, reject) => {
        try {
            scan(dir).forEach(build);
            resolve();
        } catch (error) {
            reject();
        }
    })
}

module.exports = exports = {
    backup
}