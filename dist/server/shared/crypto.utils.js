"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
function hashWithSalt(content, salt) {
    if (!salt) {
        salt = genRandomString(16);
    }
    var hashContent = crypto.pbkdf2Sync(content, salt, 100000, 512, 'sha512');
    return {
        password: hashContent.toString('hex'),
        salt: salt
    };
}
function genRandomString(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
}
exports.cryptoUtils = {
    genRandomString: genRandomString,
    hashWithSalt: hashWithSalt
};
//# sourceMappingURL=crypto.utils.js.map