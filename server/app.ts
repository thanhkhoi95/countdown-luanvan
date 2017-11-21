import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as path from 'path';
import * as socketIO from 'socket.io';
import * as http from 'http';

import { socketHandler } from './shared';

import {
    userRouter,
    staffRouter,
    authRouter,
    tableRouter,
    kitchenRouter,
    categoryRouter,
    foodRouter,
    assignmentRouter,
    imageRouter,
    orderRouter
} from './routes';

const app = express();
const server = http.createServer(app);
dotenv.load({ path: '.env' });
app.set('port', (process.env.PORT || 6969));
app.set('baseUri', '/api');



app.use('/', express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, x-access-token');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Pass to next layer of middleware
    next();
});

app.use(morgan('dev'));

if (process.env.NODE_ENV === 'test') {
    mongoose.connect(process.env.MONGODB_TEST_URI, { useMongoClient: true });
} else {
    mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
}

const db = mongoose.connection;
(<any>mongoose).Promise = global.Promise;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');

    app.use(`${app.get('baseUri')}/user`, userRouter);
    app.use(`${app.get('baseUri')}/staff`, staffRouter);
    app.use(`${app.get('baseUri')}/auth`, authRouter);
    app.use(`${app.get('baseUri')}/table`, tableRouter);
    app.use(`${app.get('baseUri')}/kitchen`, kitchenRouter);
    app.use(`${app.get('baseUri')}/category`, categoryRouter);
    app.use(`${app.get('baseUri')}/food`, foodRouter);
    app.use(`${app.get('baseUri')}/assignment`, assignmentRouter);
    app.use(`${app.get('baseUri')}/image`, imageRouter);
    app.use(`${app.get('baseUri')}/order`, orderRouter);

    app.get('/*', function(req, res) {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    socketHandler(server);

    if (!module.parent) {
        server.listen(app.get('port'), () => {
            console.log('Luanvan web service listening on port ' + app.get('port'));
        });
    }

});

export { app, server };
