const package = require("./package");

module.exports = exports = function (dist, resMerge, resMd5, zipFileName, zipMd5File) {
  return package.html(dist, resMerge, resMd5).then(function () {
    return package.zip(dist, zipFileName, zipMd5File);
  });
}