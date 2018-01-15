import {Room, User} from './connectors.js';
const resolvers = {
  Query: {
    room(root, args) {
      return Room.find({ where: args });
    },
    allRooms() {
      return Room.findAll();
    }
  },
  Room: {
    users(room) {
      return room.getUsers();
    }
  },
  User: {
    room(user) {
      return user.getRoom();
    }
  }
};

export default resolvers;
