const mongoose = require("mongoose")
const { Schema } = mongoose;

/*
  profile url
  name *
  email *
  phone (already have)
  gender *
  date (default)
*/

const ProfileSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"accounts",
  },
  profile_url: {
    type: String,
    default:"",
  },
  fname: {
    type: String,
    default:"first_name",
  },
  lname: {
    type: String,
    default:"last_name",
  },
  email: {
    type: String,
    default:"",
  },
  number: {
    type: String,
    required:true,
  },
  gender: {
    type: String,
    default:"",
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const Profile = mongoose.model("profile", ProfileSchema);
module.exports = Profile;