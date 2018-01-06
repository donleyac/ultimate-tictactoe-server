import {fromJS, List, Map} from 'immutable';
import config from './initial.json';
import joinGameStart from './joinGameStart.json';
import joinGameEnd from './joinGameEnd.json';
import placePieceStart from './placePieceStart.json';
import placePieceEnd from './placePieceEnd.json';
import {getInitial, joinGame, placePiece, switchPlayer} from '../core.js';

// test('Initial State', () => {
//   const state = getInitial();
//   expect(state).toEqual(Map(fromJS(config)));
// });
// test('Place Piece', () => {
//   const state = fromJS(place_piece_start);
//   const placed = placePiece(state, 2, 2, 1);
//   const switched = switchPlayer(placed);
//   expect(switched).toEqual(fromJS(place_piece));
// });
test('Join Game', () => {
  const state = fromJS(joinGameStart);
  const joined = joinGame(state, "apple", "john");
  expect(joined).toEqual(fromJS(joinGameEnd));
});

test('Place Piece', ()=> {
  const state = fromJS(placePieceStart);
  const placed = placePiece(state, "apple", 0, 0, 1);
  expect(placed).toEqual(fromJS(placePieceEnd));
})
