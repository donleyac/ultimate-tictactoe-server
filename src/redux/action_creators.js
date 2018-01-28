export function createRoom(room, user) {
  return {
    type: 'CREATE_ROOM',
    room: room,
    username: user
  }
}
export function joinRoom(room, user) {
  return {
    type: 'JOIN_ROOM',
    room: room,
    username: user
  }
}
export function leaveRoom(room, user) {
  return {
    type: 'LEAVE_ROOM',
    room: room,
    username: user
  }
}
export function startGame(room) {
  return {
    type: 'START_GAME',
    room: room
  };
}
export function joinGame(room, user){
  return {
    type: 'JOIN_GAME',
    room: room,
    username: user
  }
}
export function leaveGame(room, user) {
  return {
    type: 'LEAVE_GAME',
    room:room,
    username: user
  }
}
export function placePiece(room, grid, cell, playerId) {
  return {
    type: 'PLACE',
    room: room,
    grid: grid,
    cell: cell,
    playerId: playerId
  };
}
export function switchPlayer(room){
  return {
    type: 'SWITCH',
    room: room
  }
}
