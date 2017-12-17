"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var controllers_1 = require("../controllers");
var middlewares_1 = require("../middlewares");
exports.kitchenRouter = express.Router();
exports.kitchenRouter.route('/').get(function (req, res, next) {
    controllers_1.kitchenController.getKitchen(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.kitchenRouter.route('/').post(middlewares_1.parseJwt('admin'), function (req, res, next) {
    controllers_1.kitchenController.createKitchen(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.kitchenRouter.route('/setactive').put(middlewares_1.parseJwt('admin'), function (req, res, next) {
    controllers_1.kitchenController.setActiveKitchen(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.kitchenRouter.route('/').put(middlewares_1.parseJwt('admin'), function (req, res, next) {
    controllers_1.kitchenController.updateKitchen(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.kitchenRouter.route('/getAll').get(function (req, res, next) {
    controllers_1.kitchenController.getAllKitchens(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
// kitchenRouter.route('/').delete((req: express.Request, res: express.Response, next: express.NextFunction) => {
//     kitchenController.deleteKitchen(req)
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
//# sourceMappingURL=kitchen.route.js.map