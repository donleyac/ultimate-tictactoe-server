import {fromJS, List, Map} from 'immutable';
import config from './initial.json';
import joinGameST from './states/joinGame.json';
import placePieceST from './states/placePiece.json';
import {getInitial, joinGame, placePiece, switchPlayer, createRoom, joinRoom} from '../core.js';

const initialST = getInitial();
const createRoomST = createRoom(initialST, "apple", "alex");
const joinRoomST = joinRoom(createRoomST, "apple", "john");


test('Initial State', () => {
  expect(getInitial()).toMatchSnapshot();
});
test('Create Room', ()=>{
  //Standard create room
  expect(createRoomST).toMatchSnapshot();
  //Create Room that already existingUsers
  expect(createRoom(createRoomST, "apple", "john")).toMatchSnapshot();
});
test('Join Game', () => {
  expect(joinGame(fromJS(joinGameST), "apple", "john")).toMatchSnapshot();
});
test('Place Piece', ()=> {
  expect(placePiece(fromJS(placePieceST), "apple", 0, 0, 1)).toMatchSnapshot();
})
test('switchPlayer', ()=> {
  expect(switchPlayer(fromJS(placePieceST))).toMatchSnapshot();
})
