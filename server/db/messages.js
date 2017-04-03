const mongoose = require('mongoose');
const Schema = mongoose.Schema;

 const MESSAGES = new Schema({
  user: { 
    nick_name: { type: String, default: 'user' },
    avatar: { type: String, default: 'user' },
    gender: { type: String, default: 'user' },
    role: { type: String, default: 'user' },
  },
  user_id: { type: String, default: 'user' },
  message: { type: String, default: '' },
  room: { type: String, default: '' },
  created: { type: String, default: Date.now() },
  images: [String],
});

 module.exports = MESSAGES;

