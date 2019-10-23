const fs = require("fs");
const path = require("path");
const { md5 } = require("../utils/md5")

function scan(srcPath, regex) {
    var result = [];
    function scanDir(nextPath) {
        var files = fs.readdirSync(nextPath);
        if (!files.length) {
            return;
        }
        files.forEach(function (file) {
            var absFile = path.join(nextPath, file);
            var fileStat = fs.statSync(absFile);
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
    var useFiles = [];
    var nodeRegex = /(<link(([\s\S])*?)<\/link>|<link.*?(?:>|\/>))/gi;
    var hrefRegex = /href=[\"\"]?([^\"\"\>]*)[\"\"\>]?/i;
    return html.replace(nodeRegex, function (mh) {
        var hrefs = mh.match(hrefRegex);
        if (hrefs && hrefs.length > 1) {
            var href = hrefs[1].split(" ")[0];
            var nodeFile = path.join(path.dirname(file), href);
            if (fs.existsSync(nodeFile)) {
                var ext = path.extname(nodeFile);
                if (ext == ".css") {
                    if (useFiles.indexOf(nodeFile) >= 0) {
                        return "";
                    }
                    useFiles.push(nodeFile);
                    if (merge) {
                        var content = fs.readFileSync(nodeFile, "utf8");
                        return "<style>" + content + "</style>";
                    } else {
                        return "<link href=\"" + href + "\" rel=\"stylesheet\" type=\"text/css\"/>"
                    }
                }
                return "";
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
    var useFiles = [];
    var nodeRegex = /(<script(([\s\S])*?)<\/script>|<script.*?(?:>|\/>))/gi;
    var srcRegex = /src=[\"\"]?([^\"\"\>]*)[\"\"\>]?/i;
    return html.replace(nodeRegex, function (mh) {
        var srcs = mh.match(srcRegex);
        if (srcs && srcs.length > 1) {
            var src = srcs[1].split(" ")[0];
            var nodeFile = path.join(path.dirname(file), src);
            if (fs.existsSync(nodeFile)) {
                if (useFiles.indexOf(nodeFile) >= 0) {
                    return "";
                }
                useFiles.push(nodeFile);
                if (merge) {
                    var content = fs.readFileSync(nodeFile, "utf8");
                    return "<script>" + content + "</script>";
                } else {
                    return "<script src=\"" + src + "\"></script>";
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

function html(dir, merge) {
    return new Promise(function (resolve, reject) {
        try {
            scan(dir, /\.(htm|html)$/).forEach(function (item) {
                var html = fs.readFileSync(item, "utf8");
                html = style(item, html, merge);
                html = script(item, html, merge);
                fs.writeFileSync(item, html);
            });
            scan(dir, /\.(htm|html|css|js|gif|png|jpg|webp|svg|woff|zip)$/).forEach(function (item) {
                fs.writeFileSync(item + ".md5", md5(item));
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