const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

let userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    set: function (value) {return value.trim().toLowerCase()},
  },
  email: {
    type: String,
    required: true,
    set: function(value) {return value.trim().toLowerCase()},
    validate: [
      function (email) {
        return validator.isEmail(email);
      }
    ]
  },
  password: { type: String, required: true },
  admin: { type: Boolean, default: true },
  thumbnail: String,
  avatar: { type: String, default: 'img/avatar.png'},
  likes: {type: Array, default: []}
});

module.exports = mongoose.model('User', userSchema);
