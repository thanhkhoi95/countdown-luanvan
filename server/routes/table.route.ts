import * as express from 'express';
import { tableController } from '../controllers';
import { parseJwt } from '../middlewares';

export const tableRouter = express.Router();

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

tableRouter.route('/getAll').get(
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
