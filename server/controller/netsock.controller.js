var data = require('../services/data.service');

module.exports = function (io) {
    // socket connection
    io.on('connection', function (socket) {
        var userId = socket.handshake.query.userid;
        var userToken = socket.handshake.query.token;
        var ipAddress = socket.handshake.address;
        var socketId = socket.id;

        console.log(" Socket Connection: ", userId);

        // socket update announcements
        socket.on('update announcements', function (info) {
            /* TODO: AUTHENTICATE USER */
           if(info && info.list){
                data.updateAnnouncements(info.list, function(retObj){
                    io.to(socketId).emit('update announcements', retObj);
                });
           }
        });

        // socket update event
        socket.on('update event', function (info) {
            /* TODO: AUTHENTICATE USER */
           if(info && info.event){
                data.updateEvent(info.event, function(retObj){
                    io.to(socketId).emit('update event', retObj);
                });
           }
        });

        // socket update song
        socket.on('update song', function (info) {
            /* TODO: AUTHENTICATE USER */
           if(info && info.song){
                data.updateSong(info.song, function(retObj){
                    io.to(socketId).emit('update song', retObj);
                });
           }
        });

        // socket update album
        socket.on('update album', function (info) {
            /* TODO: AUTHENTICATE USER */
           if(info && info.album){
                data.updateAlbum(info.album, function(retObj){
                    io.to(socketId).emit('update album', retObj);
                });
           }
        });
    });
}