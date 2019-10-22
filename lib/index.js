const package = require("./package");

module.exports = exports = function (dist, merge = false) {
    return package.html(dist, merge).then(() => {
        return package.md5(dist);
    }).then(() => {
        return package.zip(dist);
    }).then(() => {
        return package.md5(dist);
    });
}