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
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
});

const UserModel = db.define('user', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
});

RoomModel.hasMany(UserModel);
UserModel.belongsTo(RoomModel);

db.sync({force:false});

const Room = db.models.room;
const User = db.models.user;

export { Room, User };
