import {getInitial, placePiece,localSwitch, INITIAL_STATE} from './core.js';
export default function reducer(state = INITIAL_STATE,action){
  switch(action.type) {
    case 'INITIAL_STATE':
      return getInitial();
    case 'PLACE':
      return placePiece(state, action.grid, action.cell, action.playerId);
    case 'LOCAL_SWITCH':
      return localSwitch(state);
  }
  return state;
}
