const package = require("./package");

module.exports = exports = function (dist, merge = false) {
    if (merge) {
        return package.html(dist).then(() => {
            return package.md5(dist);
        });
    } else {
        return package.md5(dist);
    }
}