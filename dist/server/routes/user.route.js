"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var controllers_1 = require("../controllers");
var middlewares_1 = require("../middlewares");
exports.userRouter = express.Router();
exports.userRouter.route('/password').put(middlewares_1.parseJwt('staffEx'), function (req, res, next) {
    controllers_1.userController.changePassword(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
//# sourceMappingURL=user.route.js.map