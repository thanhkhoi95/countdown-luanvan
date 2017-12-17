"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var controllers_1 = require("../controllers");
var middlewares_1 = require("../middlewares");
exports.orderRouter = express.Router();
exports.orderRouter.route('/').post(middlewares_1.parseJwt('staff', 'table'), function (req, res, next) {
    controllers_1.orderController.addOrder(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send(error);
    });
});
// orderRouter.route('/').put(
//     parseJwt('staff', 'kitchen', 'table'),
//     (req: express.Request, res: express.Response, next: express.NextFunction) => {
//         orderController.updateOrder(req)
//         .then((response) => {
//             res.send(response);
//         })
//         .catch((error) => {
//             res.status(error.statusCode).send(error);
//         });
//     }
// );
exports.orderRouter.route('/orderstatus').put(middlewares_1.parseJwt('staff'), function (req, res, next) {
    controllers_1.orderController.changeOrderStatus(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send(error);
    });
});
exports.orderRouter.route('/changetable').put(middlewares_1.parseJwt('staff'), function (req, res, next) {
    controllers_1.orderController.changeTable(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send(error);
    });
});
exports.orderRouter.route('/foodstatus').put(middlewares_1.parseJwt('kitchen', 'staff'), function (req, res, next) {
    controllers_1.orderController.changeFoodStatus(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send(error);
    });
});
exports.orderRouter.route('/addfood').put(middlewares_1.parseJwt('staff', 'table'), function (req, res, next) {
    controllers_1.orderController.addMoreFood(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send(error);
    });
});
exports.orderRouter.route('/').get(middlewares_1.parseJwt('staff', 'kitchen'), function (req, res, next) {
    controllers_1.orderController.getOrderById(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send(error);
    });
});
exports.orderRouter.route('/newest').get(middlewares_1.parseJwt('staff', 'kitchen'), function (req, res, next) {
    controllers_1.orderController.getNewestOrderByTableId(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send(error);
    });
});
exports.orderRouter.route('/onlinecheckout').get(middlewares_1.parseJwt('staff', 'table'), function (req, res, next) {
    controllers_1.orderController.onlineCheckout(req)
        .then(function (response) {
        res.send({ url: response.pay_url });
    })
        .catch(function (error) {
        res.status(400).send(error);
    });
});
exports.orderRouter.route('/checkoutru').get(function (req, res, next) {
    controllers_1.orderController.checkoutReturnUrl(req)
        .then(function (response) {
        console.log(response);
        res.send("<body>\n                            <script>\n                                setTimeout(function(){\n                                    document.location.replace('" + response + "');\n                                }, 200);\n                            </script>\n                        </body>");
    })
        .catch(function (error) {
        res.status(400).send(error);
    });
});
//# sourceMappingURL=order.route.js.map