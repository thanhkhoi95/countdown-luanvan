"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var dotenv = require("dotenv");
var express = require("express");
var morgan = require("morgan");
var mongoose = require("mongoose");
var path = require("path");
var http = require("http");
var shared_1 = require("./shared");
var routes_1 = require("./routes");
var app = express();
exports.app = app;
var server = http.createServer(app);
exports.server = server;
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
}
else {
    mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
}
var db = mongoose.connection;
mongoose.Promise = global.Promise;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
    app.use(app.get('baseUri') + "/user", routes_1.userRouter);
    app.use(app.get('baseUri') + "/staff", routes_1.staffRouter);
    app.use(app.get('baseUri') + "/auth", routes_1.authRouter);
    app.use(app.get('baseUri') + "/table", routes_1.tableRouter);
    app.use(app.get('baseUri') + "/kitchen", routes_1.kitchenRouter);
    app.use(app.get('baseUri') + "/category", routes_1.categoryRouter);
    app.use(app.get('baseUri') + "/food", routes_1.foodRouter);
    app.use(app.get('baseUri') + "/assignment", routes_1.assignmentRouter);
    app.use(app.get('baseUri') + "/image", routes_1.imageRouter);
    app.use(app.get('baseUri') + "/order", routes_1.orderRouter);
    app.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });
    shared_1.socketHandler(server);
    if (!module.parent) {
        server.listen(app.get('port'), function () {
            console.log('Luanvan web service listening on port ' + app.get('port'));
        });
    }
});
//# sourceMappingURL=app.js.map