const mongoose = require('mongoose');
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/pinterest");
// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String
  },
  fullname: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  posts : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],

  dp: {
    type: String, // Assuming dp is a URL or file path
  },
});

userSchema.plugin(plm);

// Create the User model
module.exports = mongoose.model('User', userSchema);

