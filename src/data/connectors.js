import Sequelize from 'sequelize';
import casual from 'casual';
import _ from 'lodash';

const db = new Sequelize('tictactoe', 'postgres', 'password', {
  dialect: 'postgres'
});

db.authenticate()
  .then(()=>{
    console.log('Connection has been established successfully.');
  })
  .catch(err=> {
    console.error('Unable to connect to the database:', err);
  });

const RoomModel = db.define('room', {
  name: { type: Sequelize.STRING }
});

const UserModel = db.define('user', {
  username: { type: Sequelize.STRING }
});

RoomModel.hasMany(UserModel);
UserModel.belongsTo(RoomModel);

// create mock data with a seed, so we always get the same
casual.seed(123);
db.sync({ force: true }).then(() => {
  _.times(10, () => {
    return RoomModel.create({
      name: casual.word
    }).then((room) => {
      return room.createUser({
        username: casual.word
      });
    });
  });
});

const Room = db.models.room;
const User = db.models.user;

export { Room, User };
