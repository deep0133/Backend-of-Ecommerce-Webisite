const mongoose = require("mongoose");
const { Schema } = mongoose;

/*
  admin_id
  category
  thumbnail
*/

const CategorySchema = new Schema({
  admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref:`accounts`
  },
  category: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    default:"",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Category = mongoose.model("categorys", CategorySchema);
module.exports = Category;
