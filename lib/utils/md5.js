const fs = require("fs");
const crypto = require("crypto");

function digest(data) {
    return crypto.createHash("md5").update(data).digest("hex");
}

function md5(file) {
    let buff = fs.readFileSync(file);
    return digest(buff);
}

module.exports = exports = {
    md5
}