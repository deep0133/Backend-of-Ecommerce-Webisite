const mongoose = require("mongoose");
const { Schema } = mongoose;

/*
  user_profile_id
  product_id
  quantity
  total_price
  progress
*/

const OrderSchema = new Schema({
  profile_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref:`profiles`
  },
  product_id: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    default:"0",
  },
  price: {
    type: String,
    default:"",
  },
  progress: {
    type: String,
    default:"",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("orders", OrderSchema);
module.exports = Order;
