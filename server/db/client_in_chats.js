const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const USER_IN_CHAT = new Schema({
  user_id:   { type: String },
  room:      { type: String },
  messages_unread: Number,
});

 module.exports = USER_IN_CHAT;