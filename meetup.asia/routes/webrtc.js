"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const util = require("util");
let io = new socket_io_1.Server({ cors: { origin: '*' } });
var room = 'room';
function var_dump(x) {
    console.log("--------------------------------");
    console.log(util.inspect(x));
    console.log("--------------------------------");
}
io.on('connection', (socket) => {
    console.log(socket.id + 'connected');
    socket.join(room);
    socket.to(room).emit('ready');
    socket.on('data', (data) => {
        var_dump(data);
        socket.to(room).emit('data', data);
    });
    socket.on('disconnect', () => {
        socket.leave(room);
    });
});
io.listen(9999);
//# sourceMappingURL=webrtc.js.map