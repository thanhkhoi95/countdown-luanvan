import * as express from 'express';
import { staffController } from '../controllers';

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

staffRouter.route('/setactive').put((req: express.Request, res: express.Response, next: express.NextFunction) => {
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

staffRouter.route('/').put((req: express.Request, res: express.Response, next: express.NextFunction) => {
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
