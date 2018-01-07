import express from 'express';
import http from 'http';
import socket from 'socket.io';
import routes from './routes.js';

export let exposedSockets = {};

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
    //For new tab purposes
    socket.emit('usernameSuccess', socket.username);
    socket.emit('joinSuccess', socket.room);

    socket.on('username', username =>{
      socket.username = username;
      //create socket to be accessed throughout server
      setExposedSockets(socket);
      //send verification back to frontend
      //TODO need to transform username with unique id
      socket.emit('usernameSuccess', username);
    });
    socket.on('disconnect', ()=> {
      socket.broadcast.to(socket.room).emit('updateroom', socket.username+ ' has disconnected to this room');
      socket.leave(socket.room);
    });
    socket.emit('state', store.getState().toJS());
    socket.on('action', store.dispatch.bind(store));
  });
  server.listen(port, () => console.log(`Listening on port ${port}`));
}

function setExposedSockets(socket){
  exposedSockets[socket.username] = socket;
}
