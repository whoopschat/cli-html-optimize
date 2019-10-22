const path = require('path');
const optimize = require(".");

function argv(index) {
    if (process.argv && process.argv.length > index) {
        return process.argv[index];
    }
}

let dir = argv(2);
let action = argv(3);

if (!dir) {
    throw new Error('Please enter optimized directory');
}

(function () {
    let dist = path.join(process.cwd(), dir);
    optimize(dist, action == 'merge' || action == '-m').catch(err => {
        console.log(err);
    });
})();