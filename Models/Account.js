const mongoose = require("mongoose")
const { Schema } = mongoose;

/*
  phone *       OTP SEND 
  password *  
*/

const CreateAccountSchema = new Schema({

  number: {
    type: String,
    required:true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  who: {
    type: String,
    default: "user",
  }
});

const Account = mongoose.model("account", CreateAccountSchema);
module.exports = Account;