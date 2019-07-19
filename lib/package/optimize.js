const fs = require("fs");
const path = require('path');
const crypto = require('crypto');

function md5(data) {
    return crypto.createHash('md5').update(data).digest('hex');
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
    fs.writeFileSync(`${file}.md5`, md5(html));
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

function optimize(dir) {
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
    optimize
}