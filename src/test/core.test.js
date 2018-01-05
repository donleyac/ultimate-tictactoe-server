import {fromJS, List, Map} from 'immutable';
import config from './initial.json';
import place_piece_start from './place_piece_start.json';
import place_piece from './place_piece.json';
import {getInitial, placePiece, switchPlayer} from '../core.js';

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
