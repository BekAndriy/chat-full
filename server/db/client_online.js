const mongoose = require('mongoose');
const Schema = mongoose.Schema;

 const USER_IN_ROOMS = new Schema({
  user: { 
    first_name: { type: String, default: 'user' },
    nick_name: { type: String, default: 'user' },
    avatar: { type: String, default: 'user' },
    gender: { type: String, default: 'user' },
    role: { type: String, default: 'user' },
  },
  user_id: { type: String, default: 'user' },
  user_session: { type: String, default: 'user' },
  client_id: { type: String, default: 'user' },
});

 module.exports = USER_IN_ROOMS;