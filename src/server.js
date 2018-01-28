import express from 'express';
import http from 'http';
import socket from 'socket.io';
import routes from './routes.js';
import {createRoom, joinRoom, leaveRoom, startGame, joinGame, placePiece, switchPlayer, leaveGame} from './redux/action_creators.js';
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
  store.subscribe(
    () => io.emit('state', store.getState().toJS())
  );
  //io.on('connection', socket..: action on new conn.
  //socket.emit(..: send state to socket(client)
  //socket.on('action',..: bind server store on client action
  io.sockets.on('connection', socket => {
    socket.on('setUsername', username =>{
      mutation.addUser(null,{username:username}).then(dbUser=>{
        let dbUsername = dbUser.dataValues.username;
        socket.username = dbUsername;
        socket.emit('usernameSuccess', dbUsername);
      });
    });
    socket.on('createRoom', (room)=>{
      mutation.createRoom(null,{name:room, username: socket.username}).then(dbRoom=>{
        let dbName = dbRoom.dataValues.name;
        socket.room = dbName;
        socket.join(dbName);
        store.dispatch(createRoom(dbName, socket.username));
        socket.emit('roomSuccess', dbName);
      });
    });
    socket.on('joinRoom', (room)=>{
      mutation.joinRoom(null,{name:room, username: socket.username}).then(dbRoom=>{
        let dbName = dbRoom.dataValues.name;
        socket.room = dbName;
        socket.join(dbName);
        store.dispatch(joinRoom(dbName, socket.username));
        socket.emit('roomSuccess', dbName);
      });
    });
    socket.on('leaveRoom', ()=>{
      mutation.leaveRoom(null,{username: socket.username});
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
    socket.on('leaveGame', ()=>{
      store.dispatch(leaveGame(socket.room, socket.username));
    })
    socket.on('placePiece',(grid,cell,playerId)=>{
      store.dispatch(placePiece(socket.room,grid,cell,playerId));
    });
    socket.on('switchPlayer', ()=>{
      store.dispatch(switchPlayer(socket.room));
    });
    socket.on('sendMessage', message=>{
      //TODO change to socket.broadcast.to to reduce sending it to socket that initially sent message
      io.sockets.in(socket.room).emit('sendMessageClients', socket.username, message);
    });
    socket.on('truncateAll',()=>{
      mutation.truncateAll();
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
