import * as express from 'express';
import { staffController } from '../controllers';
import { parseJwt } from '../middlewares';

export const staffRouter = express.Router();

staffRouter.route('/').get((req: express.Request, res: express.Response, next: express.NextFunction) => {
    staffController.getStaff(req)
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
});

staffRouter.route('/').post((req: express.Request, res: express.Response, next: express.NextFunction) => {
    staffController.createStaff(req)
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
});

staffRouter.route('/setactive').put(parseJwt('admin'), (req: express.Request, res: express.Response, next: express.NextFunction) => {
    staffController.setActiveStaff(req)
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
});

staffRouter.route('/').put(parseJwt('staffEx'), (req: express.Request, res: express.Response, next: express.NextFunction) => {
    staffController.updateStaff(req)
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
});

staffRouter.route('/getAll').get((req: express.Request, res: express.Response, next: express.NextFunction) => {
    staffController.getStaffList(req)
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
