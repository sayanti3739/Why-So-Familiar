const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  accountid: { type: String, required: true, unique: true },
  password: { type: String, required: true } // Hashed password in real apps!
});

module.exports = mongoose.model('User', userSchema);
