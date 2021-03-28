module.exports = function (server) {
    // 得到IO对象
    const io = require('socket.io')(server)
    // 监视连接（当有一个客户连接上时回调）
    io.on('connection', function (socket) {
        console.log('soketio connected')
        // 绑定sendMsg 监听, 接收客户端发送的消息
        socket.on('sendMsg', function (data) {
            console.log('服务器接收到浏览器的消息',data)
            //向客户端发送消息（名称, 数据）
            io.emit('receiveMsg', data.name + '_' + data.data)
            console.log('服务器向浏览器发送的消息',data)
        })
    })
}
