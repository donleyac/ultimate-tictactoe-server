import { Message, User, Room } from '../models';

const RoomResolve = {
	users(obj) {
		return User.findAll({
			include: [{
				model: Room,
				where: {
					id: obj.id
				}
			}]
		});
	},
	messages(obj) {
		return Message.findAll({
			where: {
				roomId: obj.id
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

export { RoomResolve, MessageResolve };
