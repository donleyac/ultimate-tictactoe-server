import { RoomResolve, MessageResolve } from './associations';
import { rooms, room, users, user, messages } from './query';

import { addMessage, createUser, addUserRoom } from './mutation';
import { messageAdded } from './subscription';

const resolvers = {
	Query: {
		rooms,
		room,
		users,
		user,
		messages
	},
	Room: RoomResolve,
	Message: MessageResolve,
	Mutation: {
		addMessage,
		createUser,
		addUserRoom
	},
	Subscription: {
		messageAdded
	}
};
export default resolvers;
