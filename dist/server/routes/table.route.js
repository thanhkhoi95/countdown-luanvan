"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var controllers_1 = require("../controllers");
var middlewares_1 = require("../middlewares");
var shared_1 = require("../shared");
exports.tableRouter = express.Router();
exports.tableRouter.route('/updatestatus').put(middlewares_1.parseJwt('staff', 'table'), function (req, res, next) {
    controllers_1.tableController.updateStatus(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.tableRouter.route('/getallactive').get(middlewares_1.parseJwt('staff', 'kitchen'), function (req, res, next) {
    var token = req.headers['x-access-token'].toString();
    shared_1.tokenVerify(token, function (err, data) {
        if (data.role === 'kitchen') {
            controllers_1.tableController.getAllTable(req, true)
                .then(function (response) {
                res.send(response);
            })
                .catch(function (error) {
                res.status(error.statusCode).send({
                    message: error.message
                });
            });
        }
        else {
            req.query.staffId = data.staff.id;
            controllers_1.assignmentController.getAssignmentListByStaffId(req)
                .then(function (assignments) {
                var response = assignments;
                response = response.data.assignments.map(function (item) {
                    return item.table;
                });
                response = {
                    message: 'Get tables successfully.',
                    data: {
                        tables: response
                    }
                };
                res.send(response);
            })
                .catch(function (error) {
                res.status(error.statusCode).send({
                    message: error.message
                });
            });
        }
    });
});
exports.tableRouter.route('/getall').get(middlewares_1.parseJwt('admin'), function (req, res, next) {
    controllers_1.tableController.getAllTable(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.tableRouter.route('/').get(function (req, res, next) {
    controllers_1.tableController.getTable(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.tableRouter.route('/').post(middlewares_1.parseJwt('admin'), function (req, res, next) {
    controllers_1.tableController.createTable(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.tableRouter.route('/setactive').put(middlewares_1.parseJwt('admin'), function (req, res, next) {
    controllers_1.tableController.setActiveTable(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.tableRouter.route('/').put(middlewares_1.parseJwt('admin'), function (req, res, next) {
    controllers_1.tableController.updateTable(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
exports.tableRouter.route('/getlist').get(function (req, res, next) {
    controllers_1.tableController.getTableList(req)
        .then(function (response) {
        res.send(response);
    })
        .catch(function (error) {
        res.status(error.statusCode).send({
            message: error.message
        });
    });
});
// tableRouter.route('/').delete((req: express.Request, res: express.Response, next: express.NextFunction) => {
//     tableController.deleteTable(req)
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
//# sourceMappingURL=table.route.js.map