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
  io.on('connection', (socket) => {
    console.log("Socket connected: " + socket.id);
    socket.emit('state', store.getState().toJS());
    socket.on('action', store.dispatch.bind(store));
  });
  server.listen(port, () => console.log(`Listening on port ${port}`));
}
