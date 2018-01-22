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
    addUser(root, args) {
      return User.build(args).save();
    },
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
        return User.update({roomId: roomId},{where: {username: args.username}});
      })
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
