"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
exports.wakeRouter = express.Router();
exports.wakeRouter.route('/').put(function (req, res, next) {
    res.send('wake up');
});
//# sourceMappingURL=wake.route.js.map