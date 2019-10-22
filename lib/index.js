const package = require("./package");

module.exports = exports = function (dist, merge = false) {
    return package.clear(dist).then(() => {
        return package.html(dist, merge);
    }).then(function () {
        return package.zip(dist);
    });
}