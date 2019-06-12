const app = require('express')();
const http = require('http').createServer(handler);
const io = require('socket.io')(http);
const fs = require('fs');

// 路由定义：／
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/login', function(req, res) {
    res.writeHead('200');
    res.end('login success');
});

function handler(reg, res) {
    fs.readFile(__dirname, './index.html', function(err, data) {
        if (err) {
            res.writeHead('500');
            return res.end('Error loading index.html');
        }

        res.writeHead(200);
        res.end(data);
    });
}

// socket.io 定义的命名空间
io.of('/post').on('connection', function(socket) {
    console.log('an user post connected');
    socket.emit('new message', {
        msg: '这是post的命名空间'
    });
});

io.of('/get').on('connection', function(socket) {
    console.log('an user get connected');
    socket.emit('new message', {
        msg: '这是get的命名空间'
    });
});

// 客户端连接成功
io.on('connection', function(socket) {
    console.log('an user connected');

    // 广播信息
    socket.broadcast.emit('chat message', '新客户端上线');

    // socket.io 1.0 版本使用的是 io.sockets.socket
    // 之后的版本使用 io.to(socketId).emit()

    // 客户端断开连接
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    // 接收客户端信息
    socket.on('chat message', function(msg) {
        console.log('message: ' + msg);

        // 给自己回复信息
        io.emit('chat message', 'back message');

        // 给除了自己已外的客户端广播信息
        socket.broadcast.emit('chat message', msg);
    });

    socket.on('close', function(data) {
        console.log('close:', data);
        // 受到客户端断开连接请求，断开与客户端的连接
        socket.disconnect(true);
    });
});

// 启动服务器
http.listen(3000, function() {
    // 给所有的客户端回复信息
    io.sockets.emit('chat message', 'every one');
    console.log('listening on *:3000');
});