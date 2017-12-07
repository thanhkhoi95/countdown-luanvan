"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var multiparty = require("connect-multiparty");
var controllers_1 = require("../controllers");
var middlewares_1 = require("../middlewares");
var multipartyMiddleware = multiparty();
exports.staffRouter = express.Router();
exports.staffRouter.route('/').get(function (req, res, next) {
    controllers_1.staffController.getStaff(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.staffRouter.route('/').post(middlewares_1.parseJwt('admin'), multipartyMiddleware, middlewares_1.uploadImage, function (req, res, next) {
    controllers_1.staffController.createStaff(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        middlewares_1.rollbackUploadedFiles(req.body.uploadedImages);
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.staffRouter.route('/setactive').put(middlewares_1.parseJwt('admin'), function (req, res, next) {
    controllers_1.staffController.setActiveStaff(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.staffRouter.route('/').put(middlewares_1.parseJwt('admin'), multipartyMiddleware, function (req, res, next) {
    controllers_1.staffController.updateStaff(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        middlewares_1.rollbackUploadedFiles(req.body.uploadedImages);
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.staffRouter.route('/avatar').put(middlewares_1.parseJwt('admin'), multipartyMiddleware, middlewares_1.uploadImage, function (req, res, next) {
    controllers_1.staffController.updateAvatar(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.staffRouter.route('/getlist').get(function (req, res, next) {
    controllers_1.staffController.getStaffList(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.staffRouter.route('/getall').get(function (req, res, next) {
    controllers_1.staffController.getAllStaffs(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
// staffRouter.route('/').delete((req: express.Request, res: express.Response, next: express.NextFunction) => {
//     staffController.deleteStaff(req)
//         .then(
//         response => {
//             res.send(response);
//         }
//         )
//         .catch(
//         error => {
//             res.status(error.statusCode).send({
//                 message: error.message
//             });
//         }
//         );
// });
//# sourceMappingURL=staff.route.js.map