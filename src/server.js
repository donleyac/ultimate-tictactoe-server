import express from 'express';
import http from 'http';
import socket from 'socket.io';
import routes from './routes.js';

export function startServer(store) {
  const port = process.env.PORT || 8090;
  const app = express();
  app.use(routes);
  const server = http.createServer(app);
  const io = socket(server);
  //.subscribe called when state tree is modified
  //io.emit sends state to all clients
  store.subscribe(
    () => io.emit('state', store.getState().toJS())
  );
  //io.on('connection', socket..: action on new conn.
  //socket.emit(..: send state to socket(client)
  //socket.on('action',..: bind server store on client action
  io.sockets.on('connection', socket => {
    socket.on('username', username =>{
      socket.username = username;
      //send verification back to frontend
      //TODO need to transform username with unique id
      socket.emit('usernameSuccess', username);
    });
    socket.on('create', (room, action) => {
      //send verification back to frontend
      //TODO add user validation whether they can join room
      //Also probably return secret room key used for validation
      socket.join(room);
      //Add room/user to server store
      //Required because roomid will be parent for roomState
      store.dispatch({type:'CREATE_ROOM', room: room, user:socket.username});
      //Callback to client to set their room
      socket.emit('joinSuccess', room);
    });
    socket.on('join', room => {
      socket.join(room);
      socket.room = room;
      //send verification back to frontend
      //TODO add user validation whether they can join room
      socket.emit('joinSuccess', room);
      socket.broadcast.to(room).emit('updateroom', socket.username+ ' has connected to this room');
    });
    socket.on('disconnect', ()=> {
      socket.broadcast.to(socket.room).emit('updateroom', socket.username+ ' has disconnected to this room');
      socket.leave(socket.room);
      io.emit('roomsStatus', io.sockets.adapter.rooms);
    });
    socket.emit('state', store.getState().toJS());
    socket.on('action', store.dispatch.bind(store));
    socket.emit('roomsStatus', io.sockets.adapter.rooms);
  });
  server.listen(port, () => console.log(`Listening on port ${port}`));
}
