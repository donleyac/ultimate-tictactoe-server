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
    player: 1
  }));
}
//TODO modify so it's specific to room
export function placePiece(state, grid, cell, player) {
  let chosenCell = state.get("board").get(grid).get("grid").get(cell);
  if(player===state.get("player") && chosenCell===0){
    //Place Piece in cells
    let placed = state.updateIn(
      ["board", grid, "grid", cell],
      0,
      cell => player
    );
    //Check Winner in Grid
    let grid_winner = placed.updateIn(
      ["board", grid],
      0,
      board => {
        return Map({
          grid: board.get("grid"),
          selectable: state.get("board").get(grid).get("selectable"),
          winner: checkWinner(board.get("grid"))
        });
      }
    );
    //Set selectable
    let selectable = grid_winner.updateIn(
      ["board"],
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
    let game_winner = selectable.updateIn(
      [],
      0,
      state => {
        let board = state.get("board");
        let mode = state.get("mode");
        let user = state.get("user");
        let winner = checkWinner(board);
        return Map({board: board, winner: winner, player:player, mode:mode, user:user});
      }
    );
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
export function switchPlayer(state){
  return state.updateIn(
    ["player"],
    0,
    player => player*-1
  );
}
