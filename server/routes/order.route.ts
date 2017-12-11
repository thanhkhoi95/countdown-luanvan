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
    parseJwt('staff'),
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

orderRouter.route('/newest').get(
    parseJwt('staff', 'kitchen'),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        orderController.getNewestOrderByTableId(req)
            .then((response) => {
                res.send(response);
            })
            .catch((error) => {
                res.status(error.statusCode).send(error);
            });
    }
);

orderRouter.route('/onlinecheckout').get(
    parseJwt('staff', 'table'),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        orderController.onlineCheckout(req)
            .then((response) => {
                res.send({url: response.pay_url});
            })
            .catch((error) => {
                res.status(400).send(error);
            });
    }
);

orderRouter.route('/checkoutru').get(
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        orderController.checkoutReturnUrl(req)
            .then((response) => {
                    res.send(`<body>
                            <script>
                                setTimeout(function(){
                                    document.location.replace('${response}');
                                }, 200);
                            </script>
                        </body>`);
            })
            .catch((error) => {
                res.status(400).send(error);
            });
    }
);
