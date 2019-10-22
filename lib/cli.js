#!/usr/bin/env node

const path = require("path");
const optimize = require(".");

function argv(index) {
    if (process.argv && process.argv.length > index) {
        return process.argv[index];
    }
}

var dir = argv(2);
var action = argv(3);

if (!dir) {
    throw new Error("Please enter optimized directory");
}

(function () {
    var dist = path.join(process.cwd(), dir);
    optimize(dist, action == "merge" || action == "-m").then(() => {
        console.log("html optimize done");
    }).catch(function (err) {
        console.log(err);
    });
})();