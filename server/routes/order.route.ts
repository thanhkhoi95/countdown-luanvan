import * as express from 'express';
import { orderController } from '../controllers';
import { parseJwt } from '../middlewares';

export const orderRouter = express.Router();

orderRouter.route('/').post(
    parseJwt('staff', 'table'),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        orderController.addOrder(req)
        .then((response) => {
            res.send(response);
        })
        .catch((error) => {
            res.status(error.statusCode).send(error);
        });
    }
);


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

orderRouter.route('/orderstatus').put(
    parseJwt('staff', 'kitchen', 'table'),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        orderController.changeOrderStatus(req)
        .then((response) => {
            res.send(response);
        })
        .catch((error) => {
            res.status(error.statusCode).send(error);
        });
    }
);

orderRouter.route('/changetable').put(
    parseJwt('staff'),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        orderController.changeTable(req)
        .then((response) => {
            res.send(response);
        })
        .catch((error) => {
            res.status(error.statusCode).send(error);
        });
    }
);

orderRouter.route('/foodstatus').put(
    parseJwt('kitchen', 'staff'),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        orderController.changeFoodStatus(req)
        .then((response) => {
            res.send(response);
        })
        .catch((error) => {
            res.status(error.statusCode).send(error);
        });
    }
);

orderRouter.route('/addfood').put(
    parseJwt('staff', 'table'),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        orderController.addMoreFood(req)
        .then((response) => {
            res.send(response);
        })
        .catch((error) => {
            res.status(error.statusCode).send(error);
        });
    }
);

orderRouter.route('/').get(
    parseJwt('staff', 'kitchen'),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        orderController.getOrderById(req)
        .then((response) => {
            res.send(response);
        })
        .catch((error) => {
            res.status(error.statusCode).send(error);
        });
    }
);
