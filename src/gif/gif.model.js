const mongoose = require('mongoose');

let gifSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true,
  },
  numLikes: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Gif', gifSchema);
