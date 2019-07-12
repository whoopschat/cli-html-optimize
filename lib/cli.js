#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const lib = require("./");

function argv(index) {
    if (process.argv && process.argv.length > index) {
        return process.argv[index];
    }
}

let dir = argv(2);
let action = argv(3);

if (!dir) {
    throw new Error('目录名不能为空');
}

(function () {
    let info = {};
    let dist = path.join(process.cwd(), dir);
    let pak = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(pak)) {
        try {
            let { name, version, offline } = require(pak);
            if (offline && typeof offline == 'object') {
                Object.assign(info, offline || {}, { name, version });
            } else {
                Object.assign(info, { name, version });
            }
        } catch (error) {
        }
    }
    if (action == 'offline') {
        lib.offline(dist, info);
    } else {
        lib.optimize(dist, info);
    }
})();