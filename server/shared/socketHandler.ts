import * as socketIO from 'socket.io';
import { tokenVerify } from './jwt.utils';
import { assignmentDao, tableDao } from '../dao';

export function socketHandler(server) {
    const io = socketIO(server);

    io.on('connection', socket => {
        console.log(`${socket.id} is connected`);
        const token = socket.handshake.query.token;
        tokenVerify(token, (error, data) => {
            if (error) {
                console.log(error);
            } else {
                if (data.role === 'staff') {
                    assignmentDao.getAssignmentListByStaffId(data.staff.id)
                        .then((response) => {

                            const rooms = response.map(r => {
                                return r.table.id;
                            });
                            socket.join(rooms, () => {
                                init(socket);
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } else if (data.role === 'kitchen') {
                    tableDao.getAllTables()
                        .then((response) => {
                            const rooms = response.map(t => {
                                return t.id;
                            });
                            console.log('Rooms kitchen:', rooms);
                            socket.join(rooms, () => {
                                init(socket);
                            });
                        })
                        .catch((err) => console.log(err));
                } else if (data.role === 'table') {
                    socket.join(data._id, () => {
                        init(socket);
                    });
                }
            }
        });
    });

    function init(socket) {

        socket.on('need-support', data => {
            socket.to(data.id).emit('listen-need-support', data);
        });

        socket.on('supported', data => {
            socket.to(data.id).emit('listen-supported', data);
        });

        socket.on('order:submit', data => {
            socket.to(data.table.id).emit('listen-submit-order', data);
        });

        socket.on('order:update', data => {
            console.log('Oder update: ', data);
            socket.to(data.table.id).emit('order:update', data);
        });

        socket.on('order:checkout', data => {
            console.log('Oder update: ', data);
            socket.to(data.table.id).emit('order:checkout', data);
        });

        socket.on('table:update', data => {
            console.log('Table update: ', data);
            console.log('Room: ', data._id);
            socket.to(data._id).emit('table:update', data);
        });

        socket.on('table:support', data => {
            socket.to(data._id).emit('table:support', data);
        });

        socket.on('disconnect', () => {
            console.log(`${socket.id} has been disconnected.`);
        });
    }
}
