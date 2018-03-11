import Sequelize from 'sequelize';

let sqlName = process.env.NODE_ENV === 'production' ? 'room' : 'testing';

const sqlite = new Sequelize('room', null, null, {
	dialect: 'sqlite',
	storage: `./${sqlName}.sqlite`,
	logging: false
});

export { sqlite };
