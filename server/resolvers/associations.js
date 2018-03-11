import { Message, User, Chatroom } from '../models';

const ChatroomResolve = {
	users(obj) {
		return User.findAll({
			include: [{
				model: Chatroom,
				where: {
					id: obj.id
				}
			}]
		});
	},
	messages(obj) {
		return Message.findAll({
			where: {
				chatroomId: obj.id
			},
			order: [
				['createdAt', 'DESC']
			]
		});
	}
}

const MessageResolve = {
	createdBy(obj) {
		return User.findOne({
			where: {
				id: obj.userId
			}
		});
	}
}

export { ChatroomResolve, MessageResolve };
