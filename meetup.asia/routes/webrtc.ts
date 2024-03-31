import { Server } from 'socket.io'
const util = require("util");

let io = new Server({ cors: { origin: '*' } });
var room = 'room'

function var_dump(x: any) {
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
        socket.to(room).emit('data',data)
    });
    socket.on('disconnect',() => {
        socket.leave(room);

    });

});



io.listen(9999);