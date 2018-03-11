import Sequelize from 'sequelize';
import casual from 'casual';
import { sqlite as db } from './connectors';
import { times } from 'lodash';

const Room = db.define('room', {
	title: { type: Sequelize.STRING }
});

const Message = db.define('message', {
	text: { type: Sequelize.STRING },
	createdAt: { type: Sequelize.DATE, defaultValue: Date.now() }
});

const User = db.define('user', {
	displayName: { type: Sequelize.STRING }
});

Message.belongsTo(User);
Message.belongsTo(Room);
Room.belongsToMany(User, {through: 'user_rooms'});
Room.hasMany(Message);
User.belongsToMany(Room, {through: 'user_rooms'});
User.hasMany(Message);


casual.seed(123);
db.sync({ force: true }).then(() => {
	times(6, () => {
		Room.create({
			title: casual.words(1)
		}).then(room => {
			times(5, () => {
				return room.createUser({
					displayName: casual.first_name
				}).then(user => {
					return room.createMessage({
						text: casual.sentences(1),
						userId: user.dataValues.id,
						createdAt: casual.unix_time
					});
				});
			});
		});
	});

});

export { Room, User, Message };
