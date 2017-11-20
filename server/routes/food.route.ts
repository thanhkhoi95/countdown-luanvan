import * as express from 'express';
import * as multiparty from 'connect-multiparty';
import { uploadImage, parseJwt } from '../middlewares';
import { foodController } from '../controllers';
import { rollbackUploadedFiles } from '../middlewares';

const multipartyMiddleware = multiparty();

export const foodRouter = express.Router();

foodRouter.route('/').get((req: express.Request, res: express.Response, next: express.NextFunction) => {
    foodController.getFood(req)
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

foodRouter.route('/').post(
    parseJwt('admin'),
    multipartyMiddleware,
    uploadImage,
    (req, res, next) => {
        foodController.createFood(req)
            .then(
            response => {
                res.send(response);
            })
            .catch(
            error => {
                rollbackUploadedFiles(req.body.uploadedImages);
                res.status(error.statusCode).send({
                    message: error.message
                });
            });
    }
);

foodRouter.route('/').put(
    parseJwt('admin'),
    multipartyMiddleware,
    uploadImage,
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        foodController.updateFood(req)
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

foodRouter.route('/setactive').put(
    parseJwt('admin'),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        foodController.setActiveFood(req)
            .then(
            response => {
                res.send(response);
            })
            .catch(
            error => {
                res.status(error.statusCode).send({
                    message: error.message
                });
            });
    }
);

foodRouter.route('/getlist').get(
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        foodController.getFoodList(req)
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

foodRouter.route('/getall').get(
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        foodController.getAllFood(req)
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
