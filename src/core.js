import {Iterable, fromJS, List, Map,is} from 'immutable';

export const INITIAL_STATE = getInitial();
export function getInitial() {
  let board = {};
  for(let i=0; i<3; i++) {
    for(let j=0; j<3; j++){
      board[""+i+j] = {
        board: fromJS([...Array(3).keys()].map(i => Array(3).fill(0))),
        selectable: true,
        winner: null
      }
    }
  }
  return Map({
    board: fromJS(board),
    winner: null,
    player: 1
  });
}
export function placePiece(state, grid, cell, playerId) {
  //Place Piece in cells
  let placed = state.updateIn(
    ["board", grid, "board"],
    0,
    board => board.setIn(cell, playerId)
  );
  //Check Winner in Grid
  let winner = placed.updateIn(
    ["board", grid],
    0,
    grid => {
      let board = grid.get("board");
      let new_grid;
      //Horizontal Check
      board.forEach(row=>{
        if(Math.abs(row.get(0)+row.get(1)+row.get(2))===3){
          new_grid = grid.set("winner",row.get(0));
        }
      });
      //Vertical Check
      board.forEach((row,index)=>{
        if(Math.abs(board.get(0).get(index)+board.get(1).get(index)+board.get(2).get(index))===3){
          new_grid=grid.set("winner",board.get(0).get(index));
        }
      });
      //Diagonal Check
      if(Math.abs(board.get(0).get(0)+board.get(1).get(1)+board.get(2).get(2))===3){
        new_grid=grid.set("winner", board.get(0).get(0));
      }
      if(Math.abs(board.get(0).get(2)+board.get(1).get(1)+board.get(2).get(0))===3){
        new_grid=grid.set("winner", board.get(0).get(2));
      }
      return Map({board: board, selectable: grid.get("selectable"), winner: new_grid?new_grid.get("winner"):grid.get("winner")});
    }
  );
  //Check Winner in Game
}
// export function modIndicator(state, playerId, label, value, op){
//   if (op==="replace"){
//     return state.updateIn(
//       ["playersById",playerId, 'indicators', label],
//       0,
//       indicator => value
//     );
//   }
//   else {
//     return state.updateIn(
//       ["playersById",playerId, 'indicators', label],
//       0,
//       indicator => indicator + value
//     );
//   }
// }
// export function modCollection(state, collect, prop, val, op){
//   //need to cast val to immutable for add and comparisons
//   if(val instanceof Array){
//     val = List(val);
//   }
//   let findIndex = function(curr,target){
//     return curr.findIndex(function(elem){
//       if(Iterable.isIterable(elem)){
//         return is(elem.get(5), target.get(5));
//       }
//       else {
//         return is(elem, target);
//       }
//     })
//   }
//   let remove = function(curr, target){
//     return curr.delete(findIndex(curr,target));
//   }
//   //TODO Method is already generic, may be able to work with just a unique operation
//   if(state.getIn(["collections",collect,"layout"])==="free" && prop==="content" && op==="chg"){
//     return state.updateIn(
//       ["collections", collect, prop],
//       0,
//       content => content.set(findIndex(content, val), val));
//   }
//   else {
//     if(op==="add"){
//       return state.updateIn(
//        ["collections", collect, prop],
//        0,
//        content => content.push(val));
//     }
//     else if(op==="rm"){
//       return state.updateIn(
//         ["collections", collect, prop],
//         0,
//         content => remove(content, val));
//     }
//     //Replace list, mainly for re-ordering
//     else {
//       return state.updateIn(
//         ["collections", collect, prop],
//         0,
//         content => val);
//     }
//   }
// }
