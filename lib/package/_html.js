const fs = require("fs");
const path = require('path');

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

function style(file, html) {
    let nodeRegex = /(<link(([\s\S])*?)<\/link>|<link.*?(?:>|\/>))/gi;
    let hrefRegex = /href=[\'\"]?([^\'\"\>]*)[\'\"\>]?/i;
    return html.replace(nodeRegex, function (mh) {
        let hrefs = mh.match(hrefRegex);
        if (hrefs && hrefs.length > 1) {
            let nodeFile = path.join(path.dirname(file), hrefs[1]).split(' ')[0];
            if (fs.existsSync(nodeFile)) {
                let ext = path.extname(nodeFile);
                if (ext == '.css') {
                    let content = fs.readFileSync(nodeFile, 'utf8');
                    return `<style>${content}</style>`;
                }
                return '';
            }
        }
        return mh;
    });
}

function script(file, html) {
    let nodeRegex = /(<script(([\s\S])*?)<\/script>|<script.*?(?:>|\/>))/gi;
    let srcRegex = /src=[\'\"]?([^\'\"\>]*)[\'\"\>]?/i;
    return html.replace(nodeRegex, function (mh) {
        let srcs = mh.match(srcRegex);
        if (srcs && srcs.length > 1) {
            let nodeFile = path.join(path.dirname(file), srcs[1]).split(' ')[0];
            if (fs.existsSync(nodeFile)) {
                let content = fs.readFileSync(nodeFile, 'utf8');
                return `<script>${content}</script>`;
            }
        }
        return mh;
    });
}

function build(file) {
    let html = fs.readFileSync(file, 'utf8');
    html = style(file, html);
    html = script(file, html);
    fs.writeFileSync(`${file}`, html);
}

function html(dir) {
    return new Promise((resolve, reject) => {
        try {
            scan(dir,/\.html$/).forEach(build);
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = exports = {
    html
}