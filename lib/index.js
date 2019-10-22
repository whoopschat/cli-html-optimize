const package = require("./package");

module.exports = exports = function (dist, merge = false) {
    return package.html(dist, merge).then(function () {
        return package.md5(dist);
    }).then(function () {
        return package.zip(dist);
    }).then(function () {
        return package.md5(dist);
    });
}