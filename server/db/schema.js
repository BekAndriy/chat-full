const mongoose = require('mongoose');
const Schema = mongoose.Schema;

 const USER_SCH = new Schema({
  name:  String,
  login:        { type: String },
  nick_name:    { type: String, default: '' },
  password:     { type: String, required: true },
  date_created: { type: Number, default: Date.now() },
  avatar:       { type: String, default: '' },
  gender:       { type: String, default: '' },
  email:        { type: String, default: '' },
  birthday:     { type: Date, default: '' },
  description:  { type: String, default: '' },
  role:         { type: String, default: 'user' },
  salt:         { type: String, require: true, },
  iteration:    { type: Number, require: true, },
  secure:       { type: String, require: true, },
  first_name:   { type: String }
});

 module.exports = USER_SCH;