import {getInitial, startGame, placePiece,switchPlayer, createRoom, INITIAL_STATE} from './core.js';
export default function reducer(state = INITIAL_STATE,action){
  switch(action.type) {
    case 'INITIAL_STATE':
      return getInitial();
    case 'START_GAME':
      return startGame(state, action.room);
    case 'PLACE':
      return placePiece(state, action.grid, action.cell, action.playerId);
    case 'SWITCH':
      return switchPlayer(state);
    case 'CREATE_ROOM':
      return createRoom(state, action.room, action.user);
  }
  return state;
}
