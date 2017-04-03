const mongoose = require('mongoose');
const Schema = mongoose.Schema;

 const REQUESTS = new Schema({
  from_user: String,
  to_user:   String,
  date:      Number
});

 module.exports = REQUESTS;