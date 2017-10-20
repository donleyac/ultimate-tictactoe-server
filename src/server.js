import express from 'express';
import http from 'http';
import socket from 'socket.io';
import axios from 'axios';
import routes from './routes.js';

export function startServer(store) {
  const port = process.env.PORT || 8090;
  const app = express();
  app.use(routes);
  const server = http.createServer(app);
  const io = socket(server);
  //.subscribe called when state tree is modified by action
  //io.emit sends state to all clients
  store.subscribe(
    () => io.emit('state', store.getState().toJS())
  );
  //io.on('connection', socket..: action on new conn.
  //socket.emit(..: send state to socket(client)
  //socket.on('action',..: bind server store on client action
  //TODO Move usernames and rooms to db
  var usernames = {};
  var rooms = {'apple':[], 'bottle':[]};
  io.sockets.on('connection', socket => {
    socket.on('create', room => {
      rooms.push(room);
      socket.emit('updaterooms', rooms, socket.room);
    });
    socket.on('join', (username, room) => {
      socket.username = username;
      usernames[username] = room;
      socket.join(room);
      socket.broadcast.to(room).emit('updateroom', username+ ' has connected to this room');
      socket.emit('updaterooms', rooms, room);
    });
    socket.on('disconnect', () => {
      delete usernames[socket.username];
      io.sockets.emit('updateusers', usernames);
      socket.broadcast.to(room).emit('updateroom', username+ ' has disconnected to this room');
      socket.leave(socket.room);
    });
    socket.emit('state', store.getState().toJS());
    socket.on('action', store.dispatch.bind(store));
  });
  server.listen(port, () => console.log(`Listening on port ${port}`));
}
