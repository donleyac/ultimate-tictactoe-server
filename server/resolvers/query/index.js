import { Room, Message, User } from '../../models/index';

const rooms = (obj, args, context) => {
	return Room.findAll();
};

const room = (obj, args, context) => {
	return Room.findOne({
		where: {
			id: args.id
		}
	}).then(room => room.dataValues);
};

const users = (obj, args, context) => {
	return 'roomId' in args ?
		User.findAll({
			include: [{
				model: Room,
				where: {
					id: args.roomId
				}
			}]
		}):
		User.findAll();
};

const user = (obj, args, context) => {
	return User.findOne({
		where: {
			id: args.id
		}
	}).then(user => user.dataValues);
};

const messages = (obj, args, context) => {
	return 'roomId' in args ?
		Message.findAll({
			where: {
				roomId: args.roomId
			}
		}) :
		Message.findAll();
};

export { rooms, room, users, user, messages };
