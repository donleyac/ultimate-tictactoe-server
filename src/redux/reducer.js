import {getInitial, startGame, placePiece,switchPlayer, createRoom,joinRoom, leaveRoom, joinGame, leaveGame, INITIAL_STATE} from './core.js';
export default function reducer(state = INITIAL_STATE,action){
  switch(action.type) {
    case 'INITIAL_STATE':
      return getInitial();
    case 'CREATE_ROOM':
      //TODO need to add validation if game already exists from data store
      return createRoom(state, action.room, action.username);
    case 'JOIN_ROOM':
      return joinRoom(state, action.room, action.username);
    case 'LEAVE_ROOM':
      return leaveRoom(state, action.room, action.username);
    case 'START_GAME':
      return startGame(state, action.room);
    case 'JOIN_GAME':
      return joinGame(state, action.room, action.username);
    case 'LEAVE_GAME':
      return leaveGame(state, action.room, action.username);
    case 'PLACE':
      return placePiece(state, action.room, action.grid, action.cell, action.playerId);
    case 'SWITCH':
      return switchPlayer(state, action.room, action.username);
  }
  return state;
}
