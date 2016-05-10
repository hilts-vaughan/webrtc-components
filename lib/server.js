var express = require('express'),
  expressApp = express(),
  socketio = require('socket.io'),
  http = require('http'),
  server = http.createServer(expressApp),
  uuid = require('node-uuid'),
  rooms = {},
  userIds = {};

expressApp.use(express.static(__dirname +
  '/../public/dist/'));

exports.run = function (config) {

  server.listen(config.PORT);
  console.log('Listening on', config.PORT);
  socketio.listen(server, { log: false })
    .on('connection', function (socket) {

      var currentRoom, id;

      socket.on('init', function (data, fn) {
        currentRoom = (data || {}).room || uuid.v4();
        var room = rooms[currentRoom];
        if (!data) {

          if (rooms[currentRoom]) {
            console.log('Tried to create room; but already created');
            fn(null, null);
            return;
          }

          rooms[currentRoom] = [socket];
          id = userIds[currentRoom] = 0;
          fn(currentRoom, id);
          console.log('Room created, with #', currentRoom);
        } else {
          if (!room) {
            console.log("No such room");
            return;
          }
          userIds[currentRoom] += 1;
          id = userIds[currentRoom];
          fn(currentRoom, id);
          room.forEach(function (s) {
            s.emit('peer.connected', { id: id });
          });
          room[id] = socket;
          console.log('Peer connected to room', currentRoom,
            'with #', id);
        }
      });

      socket.on('createRoom', function (data, callback) {
        var roomName = data.name;
        
        var isPrivate = data.isPrivate; // Supported by client API; but not currently supported on the server
        
        if (!rooms[roomName]) {
          rooms[roomName] = [] // Setup;
          id = userIds[roomName] = 0;
          console.log("Room with the name of " + roomName + " was created.");
          callback(true)
        }
        else {
          callback(false);
        }
      });

      socket.on('joinRoom', function (data, callback) {
        var roomName = data.name;
        console.log(data);

        if (rooms[roomName]) {
          var roomContext = rooms[roomName];
          currentRoom = roomName;
          
          userIds[roomName] += 1;
          id = userIds[roomName];
          callback(true, id);
          roomContext.forEach(function (s) {
            s.emit('peer.connected', { id: id });
          });
          roomContext[id] = socket;
          console.log(id);
          console.log('Peer connected to room', roomName,
            'with #', id);
        }
        else {
          callback(false, null);  
          console.log("A peer tried to join a non-existant room. Denied!");
        }
      });

      socket.on('findRooms', function (data, callback) {
        var filterKey = data.filter;
        var roomsMatched = [];
        
        // Get the rooms matching the keys
        Object.keys(rooms).forEach(function (key) {
          if (key.indexOf(filterKey) > -1) {
            roomsMatched.push(key);
          }
        });
        callback(roomsMatched);
      });
      
      // There's a bug in this msg implemenation

      socket.on('msg', function (data) {
        var to = parseInt(data.to, 10);
        if (rooms[currentRoom] && rooms[currentRoom][to]) {
          console.log('Redirecting message to', to, 'by',
            data.by);
          rooms[currentRoom][to].emit('msg', data);
        } else {
          console.warn('Invalid user');
        }
      });

      socket.on('disconnect', function () {
        if (!currentRoom || !rooms[currentRoom]) {
          return;
        }
        delete rooms[currentRoom][rooms[currentRoom].indexOf(socket)];
        rooms[currentRoom].forEach(function (socket) {
          if (socket) {
            socket.emit('peer.disconnected', { id: id });
          }
        });
      });
    });
};
