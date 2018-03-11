require('../server');

import test from 'ava';
import casual from 'casual';
import { times } from 'lodash';
import { sqlite as db } from '../server/models/connectors';
import path from 'path';
import fs from 'fs';

import { subscriptionManager } from '../server/subscriptions';
import { Room, User, Message } from '../server/models/index';
import { rooms, room, users, user, messages } from '../server/resolvers/query';
import { addMessage } from '../server/resolvers/mutation';


test.before(t => {
	casual.seed(123);
	return db.sync({ force: true }).then(() => {
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
					}).then(() => t.pass());
				});
			});
		});
	});
});

const messageStream = [];
test.before('Load subscription manager', t => {
	subscriptionManager.subscribe({
		query: `subscription {
		messageAdded(roomId:1){
			id
			text
		}
	}`,
		callback: (err, data) => {
			if (err) {
				return t.fail(err);
			} else {
				messageStream.push(data);
			}
		}
	});
});

test.before('Data seeded correctly', async t => {
	const rooms = await Room.findAll();
	const users = await User.findAll();
	const messages = await Message.findAll();
	t.is(rooms.length, 1);
	t.is(users.length, 5);
	t.is(messages.length, 5);
});

test('Query rooms', async t => {
	const data = await rooms({}, {}, {});
	t.is(data.length, 1);
});

test('Query room 1', async t => {
	const data = await room({}, { id: 1 }, {});
	t.true(data.hasOwnProperty('title'));
});

test('Query users', async t => {
	const data = await users({}, {}, {});
	t.is(data.length, 5);
});

test('Query users from room 1', async t => {
	const data = await users({}, { roomId: 1 }, {});
	t.is(data.length, 5);
});

test('Query user 1', async t => {
	const data = await user({}, { id: 1 }, {});
	t.true(data.hasOwnProperty('displayName'));
});

test('Query messages', async t => {
	const data = await messages({}, {}, {});
	t.is(data.length, 5);
});

test('Query room messages', async t => {
	const data = await messages({}, { roomId: 1 }, {});
	t.is(data.length, 5);
});

let msg = {
	text: 'Testing adding a message',
	userId: 1,
	roomId: 1
};
test.after('Mutation addMessage', async t => {
	const data = await addMessage({}, msg, {});
	t.is(data.text, msg.text);
});

test.after('Mutation publishes to pubsub', t => {
	t.is(messageStream[0].data.messageAdded.text, msg.text);
	t.is(messageStream.length, 1);
});

test.after.always('cleanup', t => {
	let testDb = path.join(__dirname, '../testing.sqlite');
	if (fs.existsSync(testDb)) {
		fs.unlink(testDb, () => {
			t.pass('Removed testing sqlite');
		});
	} else {
		t.fail('Did not find testing sqlite');
	}
});
