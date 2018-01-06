import {getInitial, startGame, placePiece,switchPlayer, createRoom,joinRoom, joinGame, INITIAL_STATE} from './core.js';
export default function reducer(state = INITIAL_STATE,action){
  switch(action.type) {
    case 'INITIAL_STATE':
      return getInitial();
    case 'START_GAME':
      return startGame(state, action.room);
    case 'JOIN_GAME':
      return joinGame(state, action.room, action.user);
    case 'PLACE':
      return placePiece(state, action.room, action.grid, action.cell, action.playerId);
    case 'SWITCH':
      return switchPlayer(state, action.room);
    case 'CREATE_ROOM':
      return createRoom(state, action.room, action.user);
    case 'JOIN_ROOM':
      return joinRoom(state, action.room, action.user);
  }
  return state;
}
