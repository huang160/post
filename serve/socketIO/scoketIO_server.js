const {ChatModel} = require('../db/models')
module.exports = function (server) {
    // 得到IO对象
    const io = require('socket.io')(server, {cors: true})
    // 监视连接（当有一个客户连接上时回调）
    io.on('connection', function (socket) {
        console.log('soketio connected')
        // 绑定sendMsg 监听, 接收客户端发送的消息
        socket.on('sendMsg', function ({from, to, content}) {
            console.log('服务器接收到客户端发送的消息',{from, to, content})
            // 处理数据(保存消息)
            // 准备chatMsg对象的相关数据
            const chat_id = [from, to].sort().join('_')// from_to或者to_from
            const create_time = Date.now()
            new ChatModel({from, to, content, chat_id, create_time}).save(function (error, chatMsg) {
                // 向所有连接上的客户端发消息
                io.emit('receiveMsg', chatMsg)
            })
        })
    })
}
