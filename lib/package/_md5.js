var fs = require("fs");
var path = require("path");
var crypto = require("crypto");

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

function digest(data) {
    return crypto.createHash("md5").update(data).digest("hex");
}

function build(file) {
    var content = fs.readFileSync(file);
    fs.writeFileSync(file + ".md5", digest(content));
}

function md5(dir) {
    return new Promise(function (resolve, reject) {
        try {
            scan(dir, /\.(htm|html|css|js|gif|png|jpg|webp|svg|woff|zip)$/).forEach(build);
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = exports = {
    md5
}