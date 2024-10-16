const package = require("./package");

module.exports = exports = function (dist, resMerge, zipFileName, zipMd5File) {
  return package.clear(dist).then(() => {
    return package.html(dist, resMerge);
  }).then(function () {
    return package.zip(dist, zipFileName, zipMd5File);
  });
}