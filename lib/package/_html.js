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

function style(file, html, merge) {
    let useFiles = [];
    let nodeRegex = /(<link(([\s\S])*?)<\/link>|<link.*?(?:>|\/>))/gi;
    let hrefRegex = /href=[\'\"]?([^\'\"\>]*)[\'\"\>]?/i;
    return html.replace(nodeRegex, function (mh) {
        let hrefs = mh.match(hrefRegex);
        if (hrefs && hrefs.length > 1) {
            let href = hrefs[1];
            let nodeFile = path.join(path.dirname(file), href).split(' ')[0];
            if (fs.existsSync(nodeFile)) {
                let ext = path.extname(nodeFile);
                if (ext == '.css') {
                    if (useFiles.indexOf(nodeFile) >= 0) {
                        return "";
                    }
                    useFiles.push(nodeFile);
                    if (merge) {
                        let content = fs.readFileSync(nodeFile, 'utf8');
                        return `<style>${content}</style>`;
                    } else {
                        return `<link href="${href}" rel="stylesheet" type="text/css"/>`
                    }
                }
                return '';
            } else {
                if (useFiles.indexOf(nodeFile) >= 0) {
                    return "";
                }
                useFiles.push(nodeFile);
            }
        }
        return mh;
    });
}

function script(file, html, merge) {
    let useFiles = [];
    let nodeRegex = /(<script(([\s\S])*?)<\/script>|<script.*?(?:>|\/>))/gi;
    let srcRegex = /src=[\'\"]?([^\'\"\>]*)[\'\"\>]?/i;
    return html.replace(nodeRegex, function (mh) {
        let srcs = mh.match(srcRegex);
        if (srcs && srcs.length > 1) {
            let src = srcs[1];
            let nodeFile = path.join(path.dirname(file), src).split(' ')[0];
            if (fs.existsSync(nodeFile)) {
                if (useFiles.indexOf(nodeFile) >= 0) {
                    return "";
                }
                useFiles.push(nodeFile);
                if (merge) {
                    let content = fs.readFileSync(nodeFile, 'utf8');
                    return `<script>${content}</script>`;
                } else {
                    return `<script src="${src}"></script>`
                }
            } else {
                if (useFiles.indexOf(nodeFile) >= 0) {
                    return "";
                }
                useFiles.push(nodeFile);
            }
        }
        return mh;
    });
}

function build(file, merge) {
    let html = fs.readFileSync(file, 'utf8');
    html = style(file, html, merge);
    html = script(file, html, merge);
    fs.writeFileSync(`${file}`, html);
}

function html(dir, merge) {
    return new Promise((resolve, reject) => {
        try {
            scan(dir, /\.(htm|html)$/).forEach((item) => {
                build(item, merge)
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = exports = {
    html
}