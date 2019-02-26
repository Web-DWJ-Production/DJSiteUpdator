var data = require('../services/data.service');

module.exports = function (io, connections) {
    // socket connection
    io.on('connection', function (socket) {
        var userId = socket.handshake.query.userid;
        var userToken = socket.handshake.query.token;
        var ipAddress = socket.handshake.address;
        var socketId = socket.id;

        // socket direct connect
        socket.on('update announcements', function (info) {
            /* TODO: AUTHENTICATE USER */
           if(info && info.list){
                data.updateAnnouncements(info.list, function(retObj){
                    io.to(socketId).emit('update announcements', retObj);
                });
           }
        });
    });
}