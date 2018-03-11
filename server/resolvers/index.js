import { ChatroomResolve, MessageResolve } from './associations';
import { chatrooms, chatroom, users, user, messages } from './query';

import { addMessage, createUser } from './mutation';
import { messageAdded } from './subscription';

const resolvers = {
	Query: {
		chatrooms,
		chatroom,
		users,
		user,
		messages
	},
	Chatroom: ChatroomResolve,
	Message: MessageResolve,
	Mutation: {
		addMessage,
		createUser
	},
	Subscription: {
		messageAdded
	}
};
export default resolvers;
