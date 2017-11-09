import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as path from 'path';

import { userRouter, staffRouter, authRouter, tableRouter, kitchenRouter, categoryRouter } from './routes';

const app = express();
dotenv.load({ path: '.env' });
app.set('port', (process.env.PORT || 4061));
app.set('baseUri', '/api');



// app.use('/', express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

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


    // app.get('/*', function(req, res) {
    //   res.sendFile(path.join(__dirname, '../public/index.html'));
    // });

    if (!module.parent) {
        app.listen(app.get('port'), () => {
            console.log('Luanvan web service listening on port ' + app.get('port'));
        });
    }

});

export { app };
