import * as express from 'express';
import { kitchenController } from '../controllers';
import { parseJwt } from '../middlewares';

export const kitchenRouter = express.Router();

kitchenRouter.route('/').get(
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
    kitchenController.getKitchen(req)
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

kitchenRouter.route('/').post(
    parseJwt('admin'),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
    kitchenController.createKitchen(req)
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

kitchenRouter.route('/setactive').put(
    parseJwt('admin'),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
    kitchenController.setActiveKitchen(req)
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

kitchenRouter.route('/').put(
    parseJwt('admin'),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
    kitchenController.updateKitchen(req)
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

kitchenRouter.route('/getAll').get(
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
    kitchenController.getKitchenList(req)
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
