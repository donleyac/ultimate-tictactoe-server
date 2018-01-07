import {getInitial, startGame, placePiece,switchPlayer, createRoom,joinRoom, leaveRoom, joinGame, INITIAL_STATE} from './core.js';
import {exposedSockets} from './server.js';
export default function reducer(state = INITIAL_STATE,action){
  let exposedSocket = exposedSockets[action.username];
  switch(action.type) {
    case 'INITIAL_STATE':
      return getInitial();
    case 'START_GAME':
      return startGame(state, action.room);
    case 'JOIN_GAME':
      return joinGame(state, action.room, exposedSocket.username);
    case 'PLACE':
      return placePiece(state, action.room, action.grid, action.cell, action.playerId);
    case 'SWITCH':
      return switchPlayer(state, action.room, action.username);
    case 'CREATE_ROOM':
      let createdState = createRoom(state, action.room, exposedSocket.username);
      //Even if room already exists, it joins the existing room
      exposedSocket.join(action.room);
      exposedSocket.emit('joinSuccess', action.room);
      //check if room actually created
      if(createdState){
        return createdState;
      }
      exposedSocket.emit('failedCreate', action.room)
      return joinRoom(state, action.room, exposedSocket.username);
    case 'JOIN_ROOM':
      exposedSocket.join(action.room);
      exposedSocket.emit('joinSuccess', action.room);
      exposedSocket.broadcast.to(action.room).emit('updateroom', exposedSocket.username+ ' has entered');
      return joinRoom(state, action.room, exposedSocket.username);
    case 'LEAVE_ROOM':
      exposedSocket.leave(action.room);
      exposedSocket.broadcast.to(action.room).emit('updateroom', exposedSocket.username+ ' has left');
      return leaveRoom(state, action.room, exposedSocket.username);
  }
  return state;
}
