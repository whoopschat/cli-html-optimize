
const fs = require("fs");
const path = require('path');
const crypto = require('crypto');

function scan(srcPath, regex) {
    let result = [];
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
            if (fileStat.isFile() && (!regex || regex.test(file.toLowerCase()))) {
                result.push(absFile);
            }
        });
    }
    scanDir(srcPath);
    return result;
}

function digest(data) {
    return crypto.createHash('md5').update(data).digest('hex');
}

function build(file) {
    let content = fs.readFileSync(file);
    fs.writeFileSync(`${file}.md5`, digest(content));
}

function md5(dir) {
    return new Promise((resolve, reject) => {
        try {
            scan(dir, /\.(htm|html|css|js|gif|png|jpg|webp|svg|woff)$/).forEach(build);
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = exports = {
    md5
}