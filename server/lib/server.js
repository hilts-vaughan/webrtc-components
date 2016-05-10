var express = require('express'),
  expressApp = express(),
  socketio = require('socket.io'),
  http = require('http'),
  server = http.createServer(expressApp),
  uuid = require('node-uuid'),
  _ = require('lodash'),
  rooms = {},
  userIds = {};

  // The socket map simply contains a listing of the users connected
  socketMap = {};

expressApp.use(express.static(__dirname +
  '/../public/dist/'));


  //CORS middleware
  var allowCrossDomain = function(req, res, next) {
      res.header('Access-Control-Allow-Origin', 'example.com');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type');

      next();
  }

  expressApp.use(allowCrossDomain);


exports.run = function (config) {

  server.listen(config.PORT);
  console.log('Listening on', config.PORT);
  socketio.listen(server, { log: true })
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

      socket.on('auth', function(data, callback) {

        // Add the user to the socket map to prevent them from seeing anything else
        // that they should not later on
        socketMap[socket.id] = socket;

        // A user should auth first... we'll check here
        var username = data.username;
        var password = data.password;

        // Connected once the socket map is live
        socketMap[socket.id].name = username;

        // magic uuid

        // Send the valid flag back to the client
        callback({
          valid: true
        });

        // Send all connected users the current socketmap
        setTimeout(sendUsers, 1000);
      });

      var sendUsers = function() {
        var sockets = _.values(socketMap);
        var names = _.map(sockets, (newSocket) => {
          return {name: newSocket.name}
        });

        // Send to each memo the user array
        sockets.forEach((memo) => {
          memo.emit('availableUsers', names);
        })
      };

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
          var recv = rooms[currentRoom][to];
          recv.emit('msg', data);
        } else {
          console.warn('Invalid user');
        }
      });

      socket.on('disconnect', function () {

        delete socketMap[socket.id];
        sendUsers();

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
