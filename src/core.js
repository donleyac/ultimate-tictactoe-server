import {Iterable, fromJS, List, Map,is} from 'immutable';

export const INITIAL_STATE = getInitial();
export function getInitial() {
  let board = [...Array(3).keys()].map(i => Array(3).fill(0));
  board.forEach(row=>{
    row.forEach((elem,index)=>{
      row[index] = {
        board: fromJS([...Array(3).keys()].map(i => Array(3).fill(0))),
        selectable: true,
        winner: 0
      }
    })
  })
  return Map({
    board: fromJS(board),
    winner: 0,
    player: 1,
    local_player: 1
  });
}
export function placePiece(state, grid, cell, playerId) {
  if(playerId===state.get("player") && state.get("board").get(grid[0]).get(grid[1]).get("board").get(cell[0]).get(cell[1])===0){
    //Place Piece in cells
    let placed = state.updateIn(
      ["board", grid[0], grid[1], "board", cell[0], cell[1]],
      0,
      board => playerId
    );
    //Set selectable
    let selectable = placed.updateIn(
      ["board"],
      0,
      board => {
        let new_board = [...Array(3).keys()].map(i => Array(3).fill(0));
        board.forEach((row,r_index)=>{
          row.forEach((elem,index)=>{
            if((r_index===cell[0] && index===cell[1]) || board.get(cell[0]).get(cell[1]).get("winner")!==0){
              if(elem.get("winner")){
                new_board[r_index][index]={board:elem.get("board"), selectable: false, winner: elem.get("winner")};
              }
              else {
                new_board[r_index][index]={board:elem.get("board"), selectable: true, winner: elem.get("winner")};
              }
            }
            else {
              new_board[r_index][index]={board:elem.get("board"), selectable: false, winner: elem.get("winner")};
            }
          });
        });
        return fromJS(new_board);
      }
    );
    //Check Winner in Grid
    let grid_winner = selectable.updateIn(
      ["board", grid[0], grid[1]],
      0,
      grid => {
        let board = grid.get("board");
        let winner = checkWinner(board);
        return Map({board: board, selectable: grid.get("selectable"), winner: winner});
      }
    );
    //Check Game Winner and change player
    let game_winner = grid_winner.updateIn(
      [],
      0,
      state => {
        let board = state.get("board");
        let winner = checkWinner(board);
        return Map({board: board, winner: winner, player:playerId*-1, local_player: state.get("local_player")});
      }
    );
    return game_winner;
  }
  return {response: "Invalid Click"};
}
function checkWinner(board) {
  if(Object(board.get(0).get(0))===board.get(0).get(0)) {    //Horizontal Check
    for(let i=0; i<board.size; i++){
      let row = board.get(i);
      if(Math.abs(row.get(0).get("winner")+row.get(1).get("winner")+row.get(2).get("winner"))===3){
        return row.get(0).get("winner");
      }
    }
    //Vertical Check
    for(let i=0; i<board.size; i++){
      if(Math.abs(board.get(0).get(i).get("winner")+board.get(1).get(i).get("winner")+board.get(2).get(i).get("winner"))===3){
        return board.get(0).get(i).get("winner");
      }
    }
    //Diagonal Check
    if(Math.abs(board.get(0).get(0).get("winner")+board.get(1).get(1).get("winner")+board.get(2).get(2).get("winner"))===3){
      return board.get(0).get(0).get("winner");
    }
    if(Math.abs(board.get(0).get(2).get("winner")+board.get(1).get(1).get("winner")+board.get(2).get(0).get("winner"))===3){
      return board.get(0).get(2).get("winner");
    }
  }
  else {
    //Horizontal Check
    for(let i=0; i<board.size; i++){
      let row = board.get(i);
      if(Math.abs(row.get(0)+row.get(1)+row.get(2))===3){
        return row.get(0);
      }
    }
    //Vertical Check
    for(let i=0; i<board.size; i++){
      if(Math.abs(board.get(0).get(i)+board.get(1).get(i)+board.get(2).get(i))===3){
        return board.get(0).get(i);
      }
    }
    //Diagonal Check
    if(Math.abs(board.get(0).get(0)+board.get(1).get(1)+board.get(2).get(2))===3){
      return board.get(0).get(0);
    }
    if(Math.abs(board.get(0).get(2)+board.get(1).get(1)+board.get(2).get(0))===3){
      return board.get(0).get(2);
    }
  }
  return 0;
}

export function localSwitch(state){
  return state.updateIn(
    ["local_player"],
    0,
    player => player*-1
  );
}
