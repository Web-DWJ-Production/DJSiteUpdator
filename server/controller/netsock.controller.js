var data = require('../services/data.service');

module.exports = function (io) {
    // socket connection
    io.on('connection', function (socket) {
        var userId = socket.handshake.query.userid;
        var userToken = socket.handshake.query.token;
        var ipAddress = socket.handshake.address;
        var socketId = socket.id;

        console.log(" Socket Connection: ", userId);

        // socket direct connect
        socket.on('update announcements', function (info) {
            /* TODO: AUTHENTICATE USER */
           if(info && info.list){
                data.updateAnnouncements(info.list, function(retObj){
                    io.to(socketId).emit('update announcements', retObj);
                });
           }
        });

        // socket direct connect
        socket.on('update song', function (info) {
            console.log("Got Request");
            /* TODO: AUTHENTICATE USER */
           if(info && info.song){
                data.updateSong(info.song, function(retObj){
                    io.to(socketId).emit('update song', retObj);
                });
           }
        });
    });
}