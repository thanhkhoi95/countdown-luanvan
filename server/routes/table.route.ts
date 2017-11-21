import * as express from 'express';
import { tableController, assignmentController } from '../controllers';
import { parseJwt } from '../middlewares';
import { tokenVerify } from '../shared';

export const tableRouter = express.Router();


tableRouter.route('/updatestatus').put(
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        tableController.updateStatus(req)
            .then(
            response => {
                res.send(response);
            }
            )
            .catch(
            error => {
                res.status(error.statusCode).send({
                    message: error.message
                });
            }
            );
    }
);

tableRouter.route('/getallactive').get(
    parseJwt('staff', 'kitchen'),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const token = req.headers['x-access-token'];
        tokenVerify(token, (err, data) => {
            if (data.role === 'kitchen') {
                tableController.getAllTable(req, true)
                .then(
                (response) => {
                    res.send(response);
                }
                )
                .catch(
                (error) => {
                    res.status(error.statusCode).send({
                        message: error.message
                    });
                }
                );
            } else {
                req.query.staffId = data.staff.id;
                assignmentController.getAssignmentListByStaffId(req)
                .then((assignments) => {
                    let response: any = assignments;
                    response = response.data.assignments.map(item => {
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
                .catch((error) => {
                    res.status(error.statusCode).send({
                        message: error.message
                    });
                });
            }
        });
    }
);

tableRouter.route('/getall').get(
    parseJwt('admin'),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        tableController.getAllTable(req)
            .then(
            (response) => {
                res.send(response);
            }
            )
            .catch(
            (error) => {
                res.status(error.statusCode).send({
                    message: error.message
                });
            }
            );
    }
);

tableRouter.route('/').get(
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        tableController.getTable(req)
            .then(
            (response) => {
                res.send(response);
            }
            )
            .catch(
            (error) => {
                res.status(error.statusCode).send({
                    message: error.message
                });
            }
            );
    }
);

tableRouter.route('/').post(
    parseJwt('admin'),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        tableController.createTable(req)
            .then(
            (response) => {
                res.send(response);
            }
            )
            .catch(
            (error) => {
                res.status(error.statusCode).send({
                    message: error.message
                });
            }
            );
    }
);

tableRouter.route('/setactive').put(
    parseJwt('admin'),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        tableController.setActiveTable(req)
            .then(
            response => {
                res.send(response);
            }
            )
            .catch(
            error => {
                res.status(error.statusCode).send({
                    message: error.message
                });
            }
            );
    }
);

tableRouter.route('/').put(
    parseJwt('admin'),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        tableController.updateTable(req)
            .then(
            response => {
                res.send(response);
            }
            )
            .catch(
            error => {
                res.status(error.statusCode).send({
                    message: error.message
                });
            }
            );
    }
);

tableRouter.route('/getlist').get(
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        tableController.getTableList(req)
            .then(
            response => {
                res.send(response);
            }
            )
            .catch(
            error => {
                res.status(error.statusCode).send({
                    message: error.message
                });
            }
            );
    }
);

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
