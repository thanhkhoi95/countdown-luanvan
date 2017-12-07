"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require("jsonwebtoken");
var fs = require("fs");
var path = require("path");
var pub = fs.readFileSync(path.join(__dirname, '../key.pem'));
var key = fs.readFileSync(path.join(__dirname, '../key.rsa'));
function tokenSign(obj, callback) {
    jwt.sign(obj, key, { algorithm: 'RS256' }, function (err, token) {
        if (err) {
            callback(err);
        }
        else {
            callback(null, token);
        }
    });
}
exports.tokenSign = tokenSign;
function tokenVerify(token, callback) {
    jwt.verify(token, pub, function (err, decoded) {
        if (err) {
            callback(err);
        }
        else {
            callback(null, decoded);
        }
    });
}
exports.tokenVerify = tokenVerify;
//# sourceMappingURL=jwt.utils.js.map