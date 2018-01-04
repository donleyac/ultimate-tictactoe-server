import {Iterable, fromJS, List, Map,is} from 'immutable';
import {winningCells, SIGNS} from './consts.js';

export const INITIAL_STATE = getInitial();
export function getInitial(){
  return Map();
}
export function createRoom(state, room, user) {
  return state.set(room, Map({
    users: fromJS([user])
  }));
}
export function startGame(state, room) {
  let board = new Array(9).fill({
    grid: new Array(9).fill(0),
    selectable: true,
    winner: 0
  });
  return state.setIn([room, "game"], Map({
    board: fromJS(board),
    winner: 0,
    activePlayer: 1,
    minPlayers: 2,
    players: Map()
  }));
}
export function joinGame(state, room, user){
  let minPlayers = state.getIn([room,"game", minPlayers]);
  let joinedState = state.updateIn(
    [room, "game", "players"],
    0,
    players=>{
      //TODO add logic that checks if user is in players before adding them
      return players.set(user, null);
    }
  )
  let players = joinedState.getIn([room,"game","players"]);
  let assignedPl;
  if(minPlayers===players.count()){
    //TODO create better mapping function, maybe take depending on game mode
    assignedPl = players.mapEntries((entry, index) => {
      if(index==0){
        return -1;
      }
      return 1;
    })
  }
  return joinedState.setIn([room,"game","players"], assignedPl);
}
export function placePiece(state, room, grid, cell, player) {
  let chosenCell = state.getIn([room,"game","board",grid,"grid",cell]);
  if(player===state.getIn([room,"game","activePlayer"]) && chosenCell===0){
    //Place Piece in cells
    let placed = state.updateIn(
      [room, "game","board", grid, "grid", cell],
      0,
      cell => player
    );
    //Check Winner in Grid
    let gridState = placed.getIn([room,"game","board", grid,"grid"]);
    let grid_winner = placed.setIn(
      [room, "game","board", grid, "grid", "winner"],
      winner=>checkwinner(gridState));
    //Set selectable
    let selectable = grid_winner.updateIn(
      [room,"game","board"],
      0,
      board => {
        let new_board = new Array(9);
        board.forEach((elem,g_index)=>{
          //Grid Index Matches Cell Index or
          //Everything but winning grids when won grid chosen
          if((g_index===cell ||
            board.get(cell).get("winner")) &&
            !elem.get("winner")){
            new_board[g_index]={grid:elem.get("grid"), selectable: true, winner: elem.get("winner")};
          }
          else {
            new_board[g_index]={grid:elem.get("grid"), selectable: false, winner: elem.get("winner")};
          }
        });
        return fromJS(new_board);
      }
    );
    //Check Game Winner and change player
    let boardState = selectable.getIn([room,"game","board"]);
    let game_winner = selectable.setIn([room,"game","board","winner"], checkwinner(boardState));
    return game_winner;
  }
  return state;
}
function checkWinner(board) {
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
    [room,"game","activePlayer"],
    0,
    player => player*-1
  );
}
