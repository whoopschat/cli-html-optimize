const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const { md5 } = require("../utils/md5");

function zip(dir, zipFileName, zipMd5File) {
  return new Promise((resolve, reject) => {
    var zipFile = path.join(dir, zipFileName || "package.zip");
    var archive = archiver("zip");
    archive.directory(dir, false);
    var output = fs.createWriteStream(zipFile);
    archive.pipe(output);
    output.on('close', function () {
      if (!!zipMd5File) {
        fs.writeFileSync(zipMd5File, md5(zipFile));
      }
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