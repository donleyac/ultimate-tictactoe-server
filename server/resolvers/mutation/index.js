import {Room,Message, User } from '../../models/index';
import { pubsub } from '../../subscriptions';

const addMessage = (obj, args, context) => {
  return Message.create({
    text: args.text,
    userId: args.userId,
    roomId: args.roomId,
  })
    .then(message => {
      return message.dataValues;
    })
    .then(message => {
      pubsub.publish('messageAdded', { messageAdded: message });
    })
    .catch(e => {
      console.error(e);
    });
};

const createUser = (obj, args, context) => {
  return User.create({
    displayName: args.displayName,
  })
    .then(user => {
      return user.dataValues;
    })
    .catch(e => {
      console.error(e);
    });
};

// const addUserRoom = (obj, args, context) => {
//   return Room.find({
//     id: args.id,
//   })
//     .then(room => {
//       return user.dataValues;
//     })
//     .catch(e => {
//       console.error(e);
//     });
// };



export { addMessage, createUser };
