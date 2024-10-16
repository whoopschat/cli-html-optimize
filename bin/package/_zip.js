const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const { md5 } = require("../utils/md5");

function zip(dir, zipFileName) {
  return new Promise((resolve, reject) => {
    var zipFile = path.join(dir, zipFileName || "package.zip");
    var archive = archiver("zip");
    archive.directory(dir, false);
    var output = fs.createWriteStream(zipFile);
    archive.pipe(output);
    output.on('close', function () {
      fs.writeFileSync(zipFile + ".md5", md5(zipFile));
      resolve();
    });
    archive.on('error', function (err) {
      reject(err);
    });
    archive.finalize();
  });
}

module.exports = exports = {
  zip
}