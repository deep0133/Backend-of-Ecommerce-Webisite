const mongoose = require("mongoose")
const { Schema } = mongoose;

/*
  category_id *    from url
  type
  product_name
  cost
  item_detail
  quantity
  date
*/

const ProductSchema = new Schema({

    admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref:`accounts`
    },
    category_id: {
      type: String,
      required:true,
    },
    type: {
      type: String,
      required: true,
    },
    product_name: {
        type: String,
        required: true,
    },
    cost: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    quantity: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Product = mongoose.model("products", ProductSchema);
module.exports = Product;