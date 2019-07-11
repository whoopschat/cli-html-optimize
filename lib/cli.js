#!/usr/bin/env node
const path = require('path');
const { optimize } = require(".");

let dir = process.argv[2];
if (!dir) {
    throw new Error('目录名不能为空');
}

(function () {
    optimize(path.join(process.cwd(), dir))
})();