const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const { md5 } = require("../utils/md5");

function zip(dir, zipFileName, md5FileName) {
  return new Promise((resolve, reject) => {
    var zipFile = path.join(dir, zipFileName || "package.zip");
    var md5File = path.join(dir, md5FileName || "package.md5");
    var archive = archiver("zip");
    const items = fs.readdirSync(dir);
    const filteredItems = items.filter(item => {
      const itemPath = path.join(dir, item);
      const relativePath = path.relative(dir, itemPath);
      return relativePath !== zipFileName
        && relativePath !== md5FileName;
    });
    filteredItems.forEach(item => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      if (stat.isDirectory()) {
        archive.directory(itemPath, item);
      } else {
        archive.file(itemPath, { name: item });
      }
    });
    var output = fs.createWriteStream(zipFile);
    archive.pipe(output);
    output.on('close', function () {
      if (!!md5FileName) {
        fs.writeFileSync(md5File, md5(zipFile));
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