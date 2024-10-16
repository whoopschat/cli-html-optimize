#!/usr/bin/env node
const path = require("path");
const minimist = require('minimist');
const program = minimist(process.argv.slice(2), []);
const optimize = require(".");

if (program.help) {
  console.log("Usage: cli-html-optimize [options]");
  console.log("  --src                src path");
  console.log("  --zipFileName        zip file name");
  console.log("  --zipMd5File         zip md5 file name");
  console.log("  --resMerge           style and js file merge");
  console.log("  --help               show help");
  console.log("");
  console.log("");
  return;
}

if (!program.src) {
  console.log('ERROR:invalid parameters [src]');
  console.log('');
  return false;
}

(function () {
  var dist = path.join(process.cwd(), program.src);
  optimize(dist, !!program.resMerge, program.zipFileName).then(() => {
    console.log("------------------------------------------");
    console.log("html optimize done.");
    console.log("------------------------------------------");
    console.log('');
  }).catch(function (err) {
    console.log("------------------------------------------");
    console.log("html optimize failure.");
    console.log("------------------------------------------");
    console.log(err.message);
    console.log('');
  });
})();
