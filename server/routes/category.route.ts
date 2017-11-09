import * as express from 'express';
import { categoryController } from '../controllers';
import { parseJwt } from '../middlewares';

export const categoryRouter = express.Router();

categoryRouter.route('/').get((req: express.Request, res: express.Response, next: express.NextFunction) => {
    categoryController.getCategory(req)
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

categoryRouter.route('/').post(parseJwt('admin'), (req: express.Request, res: express.Response, next: express.NextFunction) => {
    categoryController.createCategory(req)
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

categoryRouter.route('/setactive').put(parseJwt('admin'), (req: express.Request, res: express.Response, next: express.NextFunction) => {
    categoryController.setActiveCategory(req)
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

categoryRouter.route('/').put(parseJwt('admin'), (req: express.Request, res: express.Response, next: express.NextFunction) => {
    categoryController.updateCategory(req)
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

categoryRouter.route('/getAll').get(parseJwt('admin'), (req: express.Request, res: express.Response, next: express.NextFunction) => {
    categoryController.getCategoryList(req)
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

// categoryRouter.route('/').delete((req: express.Request, res: express.Response, next: express.NextFunction) => {
//     categoryController.deleteCategory(req)
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
