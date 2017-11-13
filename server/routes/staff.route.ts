import * as express from 'express';
import * as multiparty from 'connect-multiparty';
import { staffController } from '../controllers';
import { parseJwt, uploadImage, rollbackUploadedFiles } from '../middlewares';

const multipartyMiddleware = multiparty();

export const staffRouter = express.Router();

staffRouter.route('/').get(
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
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
    }
);

staffRouter.route('/').post(
    parseJwt('admin'),
    multipartyMiddleware,
    uploadImage,
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        staffController.createStaff(req)
            .then(
            (response) => {
                res.send(response);
            }
            )
            .catch(
            (error) => {
                rollbackUploadedFiles(req.body.uploadedImages);
                res.status(error.statusCode).send({
                    message: error.message
                });
            }
            );
    }
);

staffRouter.route('/setactive').put(
    parseJwt('admin'),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
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
    }
);

staffRouter.route('/').put(
    multipartyMiddleware,
    parseJwt('staffEx'),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        staffController.updateStaff(req)
            .then(
            response => {
                res.send(response);
            }
            )
            .catch(
            error => {
                rollbackUploadedFiles(req.body.uploadedImages);
                res.status(error.statusCode).send({
                    message: error.message
                });
            }
            );
    }
);

staffRouter.route('/avatar').put(
    parseJwt('staffEx'),
    multipartyMiddleware,
    uploadImage,
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        staffController.updateAvatar(req)
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

staffRouter.route('/getAll').get(
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
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
    }
);

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
