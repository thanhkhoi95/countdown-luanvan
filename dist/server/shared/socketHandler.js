"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socketIO = require("socket.io");
var jwt_utils_1 = require("./jwt.utils");
var dao_1 = require("../dao");
function socketHandler(server) {
    var io = socketIO(server);
    io.on('connection', function (socket) {
        console.log(socket.id + " is connected");
        var token = socket.handshake.query.token;
        jwt_utils_1.tokenVerify(token, function (error, data) {
            if (error) {
                console.log(error);
            }
            else {
                if (data.role === 'staff') {
                    dao_1.assignmentDao.getAssignmentListByStaffId(data.staff.id)
                        .then(function (response) {
                        var rooms = response.map(function (r) {
                            return r.table.id;
                        });
                        socket.join(rooms, function () {
                            init(socket);
                        });
                    })
                        .catch(function (err) {
                        console.log(err);
                    });
                }
                else if (data.role === 'kitchen') {
                    dao_1.tableDao.getAllTables()
                        .then(function (response) {
                        var rooms = response.map(function (t) {
                            return t.id;
                        });
                        console.log('Rooms kitchen:', rooms);
                        socket.join(rooms, function () {
                            init(socket);
                        });
                    })
                        .catch(function (err) { return console.log(err); });
                }
                else if (data.role === 'table') {
                    socket.join(data._id, function () {
                        init(socket);
                    });
                }
            }
        });
    });
    function init(socket) {
        socket.on('need-support', function (data) {
            socket.to(data.id).emit('listen-need-support', data);
        });
        socket.on('supported', function (data) {
            socket.to(data.id).emit('listen-supported', data);
        });
        socket.on('order:submit', function (data) {
            socket.to(data.table.id).emit('listen-submit-order', data);
        });
        socket.on('order:update', function (data) {
            console.log('Oder update: ', data);
            socket.to(data.table.id).emit('order:update', data);
        });
        socket.on('order:checkout', function (data) {
            console.log('Oder update: ', data);
            socket.to(data.table.id).emit('order:checkout', data);
        });
        socket.on('table:update', function (data) {
            console.log('Table update: ', data);
            console.log('Room: ', data._id);
            socket.to(data._id).emit('table:update', data);
        });
        socket.on('table:support', function (data) {
            socket.to(data._id).emit('table:support', data);
        });
        socket.on('disconnect', function () {
            console.log(socket.id + " has been disconnected.");
        });
    }
}
exports.socketHandler = socketHandler;
//# sourceMappingURL=socketHandler.js.map