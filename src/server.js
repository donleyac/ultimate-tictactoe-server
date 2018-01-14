import express from 'express';
import http from 'http';
import socket from 'socket.io';
import routes from './routes.js';
import {createRoom, joinRoom, leaveRoom, startGame, joinGame, placePiece, switchPlayer} from './action_creators.js';

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
    socket.on('setUsername', username =>{
      socket.username = username;
      //TODO need to transform username with unique id
      socket.emit('usernameSuccess', username);
    });
    socket.on('createRoom', (room)=>{
      socket.room = room;
      socket.join(room);
      //TODO need to verify with data store before emitting
      //Want room info to be available to everyone
      store.dispatch(createRoom(room, socket.username));
      socket.emit('roomSuccess', room);
    });
    socket.on('joinRoom', (room)=>{
      socket.room = room;
      socket.join(room);
      //Want room info to be available to everyone
      store.dispatch(joinRoom(room, socket.username));
      socket.emit('roomSuccess', room);
    });
    socket.on('leaveRoom', ()=>{
      store.dispatch(leaveRoom(socket.room, socket.username));
      socket.leave(socket.room);
      socket.room=null;
      socket.emit('roomSuccess', null);
    })
    //Using sockets strings instead of actions so we can pass socket stored variables
    socket.on('startGame', ()=>{
      store.dispatch(startGame(socket.room, socket.username));
    });
    socket.on('joinGame', ()=>{
      store.dispatch(joinGame(socket.room, socket.username));
    });
    socket.on('placePiece',(grid,cell,playerId)=>{
      store.dispatch(placePiece(socket.room,grid,cell,playerId));
    });
    socket.on('switchPlayer', ()=>{
      store.dispatch(switchPlayer(socket.room));
    });
    socket.on('sendMessage', action=>{
      socket.broadcast.to(socket.room).emit('sendMessageClients', action);
    });
    socket.on('disconnect', ()=> {
      store.dispatch(leaveRoom(socket.room, socket.username));
      socket.leave(socket.room);
      socket.room=null;
      socket.emit('roomSuccess', null);
    });
    //TODO need to section state returned to the frontend by room
    socket.emit('state', store.getState().toJS());
    socket.on('action', store.dispatch.bind(store));
  });
  server.listen(port, () => console.log(`Listening on port ${port}`));
}
