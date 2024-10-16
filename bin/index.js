const package = require("./package");

module.exports = exports = function (dist, mergeFlag = false, zipFileName) {
  return package.clear(dist).then(() => {
    return package.html(dist, mergeFlag);
  }).then(function () {
    return package.zip(dist, zipFileName);
  });
}