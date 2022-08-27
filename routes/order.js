const express = require("express");
const router = express.Router();
const Profile = require("../Models/Profile");
const Order = require("../Models/Order");
const fetchuser = require("../Middleware/fetchuser");

//Route 2.1 : Fetch Order using : Get "/api/order"     ==> login  require
router.get("/order",fetchuser, async (req, res) => {
  try {
    const profile_data = await Profile.findOne({user_id:req.userId});
    if(!profile_data){
      return res.status(200).send({status:false, error:"Create your Account first:"})
    }
    const profileId = profile_data._id.toString();
    const order = await Order.find({profile_id:profileId});

    res.json(order);
  } catch (err) {
    console.log("fetch category error : " + err);
  }
});

//Route 2.2 : Add Order using :   POST   ::   login require
router.post(`/addNewOrder/:id`,
  fetchuser,
  async (req, res) => {
    console.log("in addNewOrder category id : " + req.params.id);
    try {

      // fetching user profile data:
      const profile_data = await Profile.findOne({user_id:req.userId})
      if(!profile_data){
        return res.send({"order":false, error:"login required"});
      }
      
      const profile_id = profile_data._id;

      const order_exist = await Order.findOne({
        product_id: req.params.id,
      })

      if(order_exist){
        return res.send({status:false,error:"You can't add again the same order.you only update the quantity of order."})
      }

      const add_new_order = new Order({
        profile_id:profile_id,
        product_id: req.params.id,
        quantity: req.body.quantity,
        price: req.body.price,
      });

      // save order in data base:
      const saveOrder = await add_new_order.save();
      return res.send(saveOrder);

    } catch (err) {
      return res.status(500).send({ error: err });
    }
  }
);

//Route 2.3 : Update Order using :  Put       ==> login require
router.put(`/editOrder/:id`, fetchuser, async (req, res) => {

  try{
    const updateOrder = {};

    if (req.body.quantity) {
      updateOrder.quantity = req.body.quantity;
    }
    if (req.body.price) {
      updateOrder.price = req.body.price;
    }

    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).send("Order Not Found");
    }

    const profileId = await order.profile_id;

    let userId = await Profile.findById({_id:profileId}).user_id;
    
    // user exits or not?
    if (userId != req.userId) {
      return req.send({
        status: false,
        error: "You can't edit order:",
      });
    }

    // updating order...
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updateOrder },
      { new: true }
    );
    res.send(updatedOrder);

  }
  catch(err){
    console.log("Error : "+err)
    return res.send({status:false,error:"Some Error Occured"})
  }
});

//Route 2.4 : Delete Order using : Delete "/api/order/fetchuser"     ==> login require
router.delete(`/cancelOrder/:id`, fetchuser, async (req, res) => {

  try{

    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).send({status:false,error:"Order Not Found"});
    }

    const profileData = await Profile.findById({_id:order.profile_id});
    const userId = profileData.user_id;
    if(userId != req.userId){
      return res.send({status:false,error:"You can't cancel this order:"})
    }

    // Deleting the order:
    order = await Order.findByIdAndDelete(req.params.id);
    return res.json({status:true,msg:"Order is deleted successfully from db:"});
  }
  catch(err){
    return res.status(400).send({satus:false,error:"Try Again"})
  }
});

module.exports = router;
