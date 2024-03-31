//npm install --production
//alias myproject='cd /var/www/html/meetup.asia'
//unalias myproject
//alias meetup = 'cd /var/www/html/meetup.asia'
//du -h -s
/*Remember that aliases are not persistent,
which means they will be lost when you close your terminal session.
If you want to make an alias permanent, you can add it to your shell's configuration file
(e.g., ~/.bashrc or ~/.zshrc), so that it's loaded every time you start a new terminal session. */

// sudo systemctl restart nginx
//ps aux | grep node
//sudo kill -9 $(sudo lsof -t -i:3000)
//sudo rm -rf /tmp/.com.google.*
//https://pfertyk.me/2020/03/webrtc-a-working-example/
//https://socket.io/docs/v3/server-socket-instance/
//conn.query('insert into socket (sid) values (%s);', [socket.id], (err:Error, res:OkPacket) => {
//

import { exec } from 'child_process';
import * as express from 'express';
import { AddressInfo } from "net";
import * as path from 'path';
import vhost from 'vhost';
import { mysql_user, conn } from './sql';
import { Server, Socket } from 'socket.io'
import { promisify, inspect } from 'util'
//const http = require('http');

import routes from './routes/index';
import users from './routes/user';
import { OkPacket } from 'mysql';
import { resolve } from 'path';
import { rejects } from 'assert';
import { promises } from 'dns';




function var_dump(x: any) {
    console.log("--------------------------------");
    console.log(inspect(x));
    console.log("--------------------------------")

}


const debug = require('debug')('my express app');
const app = express();
//const httpserver = http.createServer(app);
/*
const io = new Server({
    cors: {
        origin: "https://meetup.asia",
        methods: ["GET", "POST"]
    }
});
*/

//app.use(adminJs.options.rootPath, adminJs.router)


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
console.log(path.join(__dirname, 'public'))
app.use(express.static(path.join(__dirname, 'public')));


app.use('*', (req, res, next) => {
    if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
            req.headers["user-agent"]
        )
    ) {
        // Instead of redirecting to another view you can also render a separate
        // view for mobile view e.g. res.render('mobileview');

        res.locals.mobile = true;
    } else {
        res.locals.mobile = false;
    }
    next();

});

app.use('/', routes);
app.use('/users', users);





// catch 404 and forward to error handler
app.use((req, res, next) => {

    const err = new Error('Not Found');
    console.log('404');
    err['status'] = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => { // eslint-disable-line @typescript-eslint/no-unused-vars
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', 3000);


//equire('http').createServer(app);
//function insres(err: Error, res: OkPacket){}

const server = app.listen(app.get('port'), function () {
    console.log('app listen on ' + app.get('port'))
    debug('Express server listening on port ${(server.address() as AddressInfo).port}');
});

let io = new Server({ cors: { origin: '*' } });
conn.query('delete from socket where 1;', [], (err, res) => { });

function leave(socket: Socket): Promise<string> {
    return new Promise((resolve, rejects) => {
        conn.query('select sid,room from socket where sid=? or room=?;', [socket.id, socket.id], (err, res: any[]) => {
            if (err) throw err;
            if (res.length > 0) {
                if (res[0].sid === socket.id) {
                    conn.query('delete from socket where sid=?;', [socket.id], (err) => {
                        if (err) throw err;
                        if (res[0].room != null) {
                            conn.query('insert into socket (sid) values (?);', [res[0].room], (err) => {
                                if (err) throw err;
                                resolve(res[0].room);
                            });
                        }
                        else {
                            resolve(null);
                        }
                    });

                }
                else {
                    conn.query('update socket set room=NULL where room=?;', [socket.id], (err) => { if (err) throw err; resolve(res[0].sid); });

                }
            }
            else {
                resolve(null);
            }
        });
    });

}
function join(socket: Socket): void {
    conn.query('select sid,room from socket where room is null order by RAND() limit 1;', [], (err, res: any[]) => {
        if (err) throw err;
        console.log('join insert')
        var_dump(res);
        if (res.length == 0) {
            conn.query("insert into socket (sid) values (?) ;", [socket.id], (err, res) => {
                if (err) throw err;
                console.log('joing insert:' + socket.id)

            });

        }
        else {
            conn.query('update socket set room=? where sid=? ;', [socket.id, res[0].sid], err => {
                if (err) throw err;

                console.log(socket.id + 'joing update:' + res[0].sid)
                socket.to(res[0].sid).emit('ready');
            });

        }
    });
}

function towho(socket: Socket): Promise<string> {
    return new Promise((resolve,reject) => {
        conn.query('select sid,room from socket where sid=? or room=? limit 1;', [socket.id, socket.id], (err, res: any[]) => {
            if (err) throw err;
            if (res.length > 0) {
                let t;
                if (res[0].sid == socket.id)
                    t = res[0].room;
                else
                    t = res[0].sid
                resolve(t)

            }
            else {
                reject('r');
            }
        });
    });


}

io.on('connect', (socket) => {
    console.log(socket.id + 'connected');


    socket.on('data', (data) => {
        //var_dump(data);
        towho(socket).then((t) => { socket.to(t).emit('data', data) }).catch(() => { });

    });

    socket.on('disconnecting', () => {
        leave(socket).then((s) => { if (s != null) socket.to(s).emit('next'); });
    });
    socket.on('stop', () => {
        leave(socket).then((s) => { if (s != null) socket.to(s).emit('next'); });
    });

    socket.on('next', () => {
        leave(socket).then((s) => {
            if (s != null) { socket.to(s).emit('next'); }
            join(socket);
        });
    });

    socket.on('message', (text) => {
        towho(socket).then((t) => { socket.to(t).emit('message', text) }).catch(() => { });
    });

});

const ioport = 8880;
io.listen(ioport)
console.log('io listen on:' + ioport)


/*
httpserver.listen(3000, () => {
    console.log('listening on *:3000');
});
*/