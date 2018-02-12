import express from 'express';
import http from 'http';
import socket from 'socket.io';
import routes from './routes.js';
import resolver from './data/resolvers.js';
const query= resolver['Query'];
const mutation = resolver['Mutation'];

export function startServer() {
  const port = process.env.PORT || 8090;
  const app = express();
  app.use(routes);
  const server = http.createServer(app);
  const io = socket(server);
  //io.on('connection', socket..: action on new conn.
  io.sockets.on('connection', socket => {
    socket.on('truncateAll',()=>{
      mutation.truncateAll();
    });
    socket.on('disconnect', ()=> {
      mutation.leaveRoom(null,{username: socket.username}).then(()=>{
        io.sockets.in(socket.room).emit('action',
        {
          type: 'LEAVE_ROOM',
          room: socket.room,
          username: socket.username
        });
        socket.leave(socket.room);
        socket.room=null;
        socket.emit('roomSuccess', null);
      });
    });
    socket.on('action', action=>{
      switch(action.type) {
        case 'CREATE_USERNAME':
          mutation.addUser(null,{username:action.username}).then(dbUser=>{
            let dbUsername = dbUser.dataValues.username;
            socket.username = dbUsername;
            //TODO move username info to session/token for client
            socket.emit('usernameSuccess', dbUsername);
            _dispatch(action);
          });
          break;
        case 'CREATE_ROOM':
          mutation.createRoom(null,{name:action.room, username: socket.username}).then(dbRoom=>{
            let dbName = dbRoom.dataValues.name;
            socket.room = dbName;
            socket.join(dbName);
            socket.emit('roomSuccess', dbName);
            _dispatch(action);
          });
          break;
        case 'JOIN_ROOM':
          mutation.joinRoom(null,{name:action.room, username: socket.username}).then(dbRoom=>{
            let dbName = dbRoom.dataValues.name;
            socket.room = dbName;
            socket.join(dbName);
            socket.emit('roomSuccess', dbName);
            _dispatch(action);
          });
          break;
        case 'LEAVE_ROOM':
          mutation.leaveRoom(null,{username: socket.username});
          socket.leave(socket.room);
          socket.room=null;
          socket.emit('roomSuccess', null);
          _dispatch(action);
          break;
        default:
          _dispatch(action);
      }
    });
    function _dispatch(action) {
      action["room"] = socket.room;
      action["username"] = socket.username;
      io.sockets.in(socket.room).emit('action', action);
    }
  });
  server.listen(port, () => console.log(`Listening on port ${port}`));
}
