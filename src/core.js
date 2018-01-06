import {Iterable, fromJS, List, Map,is} from 'immutable';
import {winningCells, SIGNS} from './consts.js';

export const INITIAL_STATE = getInitial();
export function getInitial(){
  return Map({rooms: Map()});
}
export function createRoom(state, room, user) {
  return state.setIn(["rooms", room], Map({
    users: fromJS([user])
  }));
}
export function joinRoom(state, room, user) {
  return state.updateIn(["rooms", room, "users"],
  0,
  existingUsers=>existingUsers.push(user));
}
export function startGame(state, room) {
  let board = new Array(9).fill({
    grid: new Array(9).fill(0),
    selectable: true,
    winner: 0
  });
  return state.setIn(["rooms", room, "game"], Map({
    board: fromJS(board),
    winner: 0,
    activePlayer: 1,
    minPlayers: 2,
    players: Map()
  }));
}
export function joinGame(state, room, user){
  let minPlayers = state.getIn(["rooms", room,"game", "minPlayers"]);
  let joinedState = state.updateIn(
    ["rooms", room, "game", "players"],
    0,
    players=>{
      //TODO add logic that checks if user is in players before adding them
      return players.set(user, null);
    }
  )
  let players = joinedState.getIn(["rooms",room,"game","players"]);
  if(minPlayers===players.count()){
    //TODO create better mapping function, maybe take depending on game mode
    let assignedPl = players.mapEntries(([k,v], index) => {
      if(index==0){
        return [k, -1];
      }
      return [k, 1]
    });
    return joinedState.setIn(["rooms", room,"game","players"], assignedPl);
  }
  return joinedState;
}
export function placePiece(state, room, grid, cell, playerId) {
  let chosenCell = state.getIn(["rooms", room,"game","board",grid,"grid",cell]);
  if(playerId===state.getIn(["rooms", room,"game","activePlayer"]) && chosenCell===0){
    //Place Piece in cells
    let placed = state.updateIn(
      ["rooms", room, "game","board", grid, "grid", cell],
      0,
      cell => playerId
    );
    //Check Winner in Grid
    let gridState = placed.getIn(["rooms", room,"game","board", grid,"grid"]);
    let grid_winner = placed.setIn(
      ["rooms", room, "game","board", grid, "grid", "winner"],
      winner=>checkwinner(gridState));
    //Set selectable
    let selectable = grid_winner.updateIn(
      ["rooms", room,"game","board"],
      0,
      board => {
        let new_board = new Array(9);
        board.forEach((elem,g_index)=>{
          //Grid Index Matches Cell Index or
          //Everything but winning grids when won grid chosen
          if((g_index===cell ||
            board.get(cell).get("winner")) &&
            !elem.get("winner")){
            new_board[g_index]=elem.set("selectable", true);
          }
          else {
            new_board[g_index]=elem.set("selectable", false);
          }
        });
        return fromJS(new_board);
      }
    );
    //Check Game Winner and change player
    let boardState = selectable.getIn(["rooms", room,"game","board"]);
    let game_winner = selectable.setIn(["rooms", room,"game","board","winner"], checkWinner(boardState));
    return game_winner;
  }
  return state;
}
function checkWinner(board) {
  console.log("checkWinner", board);
  //Board
  if(Object(board.get(0))===board.get(0)) {
    for(let i = 0; i<board.size-1; i++) {
      const [a,b,c] = winningCells[i];
      if(board.get(a).get("winner") === board.get(b).get("winner") &&
      board.get(b).get("winner") === board.get(c).get("winner") &&
      board.get(c).get("winner") !== SIGNS.EMPTY) {
        return board.get(a).get("winner");
      }
    }
  }
  //Grid
  else {
    for(let i = 0; i<board.size-1; i++) {
      const [a,b,c] = winningCells[i];
      if(board.get(a) === board.get(b) &&
      board.get(b) === board.get(c) &&
      board.get(c) !== SIGNS.EMPTY) {
        return board.get(a);
      }
    }
  }
  return 0;
}
//TODO change so it's specific to room
export function switchPlayer(state, room){
  return state.updateIn(
    ["rooms", room,"game","activePlayer"],
    0,
    player => player*-1
  );
}
