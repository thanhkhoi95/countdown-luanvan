"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("../shared");
function parseJwt() {
    var roles = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        roles[_i] = arguments[_i];
    }
    return function (req, res, next) {
        var token = req.headers['x-access-token'].toString();
        if (token) {
            shared_1.tokenVerify(token, function (err, decoded) {
                if (err) {
                    res.status(401).json({
                        message: 'Invalid User or Token'
                    });
                }
                else if (roles.indexOf('admin') > -1 && decoded.role === 'admin') {
                    next();
                }
                else {
                    req.body.authInfo = decoded;
                    for (var i in roles) {
                        if (roles[i] === 'staffEx') {
                            if (req.query.id !== decoded.staff.id) {
                                res.status(550).json({
                                    message: 'Permission denied'
                                });
                                return;
                            }
                            else {
                                next();
                                return;
                            }
                        }
                        else if (roles[i] === decoded.role) {
                            next();
                            return;
                        }
                    }
                    res.status(550).json({
                        message: 'Permission denied'
                    });
                    return;
                }
            });
        }
        else {
            res.status(401).send({
                message: 'Unauthorized.'
            });
        }
    };
}
exports.parseJwt = parseJwt;
//# sourceMappingURL=jwt-parser.js.map