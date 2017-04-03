const mongoose = require('mongoose');
const Schema = mongoose.Schema;

 const CHATS = new Schema({
  date:       Number,
  name:       String,
  description:String
});

 module.exports = CHATS;