import {Room, User} from './connectors.js';
const resolvers = {
  Query: {
    room(root, args) {
      return Room.find({ where: args });
    },
    user(root, args) {
      return User.find({where: args});
    },
    allRooms() {
      return Room.findAll();
    },
    allUsers() {
      return User.findAll();
    }
  },
  Mutation: {
    //TODO check for uniqueniess, add onto version
    addUser(root, args) {
      return User.build(args).save();
    },
    //TODO check for uniqueness, if exists, add them to room
    createRoom(root, args) {
      return Room.build({name: args.name}).save().then(result=>{
        let roomId = result.dataValues.id;
        User.update({roomId: roomId},{where: {username: args.username}});
        return result;
      });
    },
    joinRoom(root,args) {
      return Room.find({name: args.name}).then(result=>{
        let roomId = result.dataValues.id;
        User.update({roomId: roomId},{where: {username: args.username}});
        return result;
      })
    },
    leaveRoom(root,args) {
      return User.update({roomId: null},{where: {username: args.username}});
    },
    truncateAll(args){
      User.truncate({ cascade: true });
      Room.truncate({ cascade: true });
      return null;
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
