import express from 'express';
import http from 'http';
import socket from 'socket.io';
import routes from './routes.js';
import resolver from './data/resolvers.js';
const query= resolver['Query'];
const mutation = resolver['Mutation'];

export function startServer(store) {
  const port = process.env.PORT || 8090;
  const app = express();
  app.use(routes);
  const server = http.createServer(app);
  const io = socket(server);
  //.subscribe called when state tree is modified
  //io.emit sends state to all clients
  //TODO only send relevant state to clients
  store.subscribe(
    () => io.emit('state', store.getState().toJS())
  );
  //io.on('connection', socket..: action on new conn.
  //socket.emit(..: send state to socket(client)
  //socket.on('action',..: bind server store on client action
  io.sockets.on('connection', socket => {
    socket.on('sendMessage', message=>{
      //TODO change to socket.broadcast.to to reduce sending it to socket that initially sent message
      io.sockets.in(socket.room).emit('sendMessageClients', socket.username, message);
    });
    socket.on('truncateAll',()=>{
      mutation.truncateAll();
    });
    socket.on('disconnect', ()=> {
      mutation.leaveRoom(null,{username: socket.username});
      store.dispatch({
        type: 'LEAVE_ROOM',
        room: socket.room,
        username: socket.username
      });
      socket.leave(socket.room);
      socket.room=null;
      socket.emit('roomSuccess', null);
    });
    socket.emit('state', store.getState().toJS());
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
      store.dispatch(action);
    }
  });
  server.listen(port, () => console.log(`Listening on port ${port}`));
}
