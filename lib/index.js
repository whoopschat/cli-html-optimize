const package = require("./package");

module.exports = exports = function (dist) {
    return package.backup(dist).then(() => {
        return package.optimize(dist).then(() => {
            return package.md5(dist);
        });
    })
}