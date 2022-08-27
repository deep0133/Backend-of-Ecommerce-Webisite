const express = require("express");
const router = express.Router();
const Account = require("../Models/Account");
const Category = require("../Models/Category");
const Product = require("../Models/Product");
const fetchuser = require("../Middleware/fetchuser");
const { body, validationResult } = require("express-validator");

//Route 1.1 : Fetch Category using : Get         ==> login not require
router.get("/category", async (req, res) => {

  try {
    const categories = await Category.find();
    console.log("fetchCategory without login: " );
    res.json(categories);
  } catch (err) {
    console.log("fetch category error : " + err);
  }
});

//Route 1.2 : Add Category using :    Post       ==> login require    
router.post("/addCategory",fetchuser,
  [body("category", "length should be greater than 1:").isLength({ min: 2 })],
  async (req, res) => {
    console.log("in addCategory user id : ", req.userId);
    try {
      // if there are errors return bad request and errors:
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // is admin want to add category?
      const adminId = await Account.findById(req.userId);

      // user exits or not?
      if (!adminId) {
        return req.send({ status: false, error: "Admin not found" });
      }

      if (adminId.who !== "admin") {
        return res
          .status(401)
          .send({
            status: false,
            error: "You have not permission to add Category",
          });
      }

      // check : category exit or not.  => findOne  function match all category in document with given category.
      let category_check_db = await Category.findOne({
        category: req.body.category,
      });

      if (category_check_db) {
        return res.status(400).json({
          success: false,
          error: "Sorry category is alredy exist:",
        });
      }

      // addCategory == >> object is created:
      const addCategory = new Category({
        admin_id:req.userId,
        category: req.body.category,
        thumbnail: req.body.thumbnail,
      });

      // save note in data base:
      const saveCategory = await addCategory.save();
      console.log(saveCategory);
      res.send(saveCategory);
    } catch (err) {
      console.log("Error : " + err);
      res.status(500).send({status:false,error:`Some error occured:`});
    }
  }
);

//Route 1.3 : Delete Category using : Delete "/api/deleteCategory"     ==> login require
router.delete(`/deletecategory/:id`,fetchuser, async (req, res) => {
  // Find the category to be deleted:
  let category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).send("Category Not Found");
  }

  // admin want to delete?
  if (category.admin_id.toString() !== req.userId) {
    return res.status(401).send("You can't change it");
  }

  // Delete the note now:
  category = await Category.findByIdAndDelete(req.params.id);

  res.json("Category is deleted successfully from db: ");
});


//Route 2.1 : Fetch Product using : Get "/api/product"     ==> no login  require
router.get("/product", async (req, res) => {
  try {
    const product = await Product.find();
    res.json(product);
  } catch (err) {
    console.log("fetch category error : " + err);
  }
});

//Route 2.2 : Add Product using :     Post       ==> login require
router.post(`/addNewProduct/:id`,fetchuser,
  [
    body("product_name", "length should be greater than 0:").isLength({
      min: 1,
    }),
  ],
  async (req, res) => {
    try {
      // if there are errors return bad request and errors:
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // is admin want to add category?
      const adminId = await Account.findById(req.userId);

      // user exits or not?
      if (!adminId) {
        return req.send({ status: false, error: "Admin not found" });
      }

      if (adminId.who !== "admin") {
        return res
          .status(401)
          .send({
            status: false,
            error: "You have not permission to add Category",
          });
      }

      // product exit or note
      const product_find_db = await Product.findOne({
        admin_id:req.userId,
        product_name: req.body.product_name,
        category_id: req.params.id,
        type: req.body.type,
      });

      if(product_find_db){
        console.log(product_find_db)
        return res.send({status:false,error:"sorry product is already added:",msg:"Try Again with different category or type or name  of product "})
      } 

      // addCategory == >> object is created:
      const add_new_product = new Product({
        admin_id:req.userId,
        category_id: req.params.id,
        type: req.body.type,
        product_name: req.body.product_name,
        cost: req.body.cost,
        description: req.body.description,
        quantity: req.body.quantity,
      });

      // save note in data base:
      const saveProduct = await add_new_product.save();
      res.send(saveProduct);

    } catch (err) {
      console.log("Error : " + err);
      res.status(500).send({status:false, error: err });
    }
  }
);

//Route 2.3 : Update Product using :  Post       ==> login require
router.put(`/editNewProduct/:id`, fetchuser, async (req, res) => {
  // Creating New Note :
  const updateProdut = {};

  if (req.body.type) {
    updateProdut.type = req.body.type;
  }
  if (req.body.product_name) {
    updateProdut.product_name = req.body.product_name;
  }
  if (req.body.description) {
    updateProdut.description = req.body.description;
  }
  if (req.body.cost) {
    updateProdut.cost = req.body.cost;
  }
  if (req.body.quantity) {
    updateProdut.quantity = req.body.quantity;
  }
  // category_id : req.params.id,

  // Find the Product to be updated:
  let findInDb = await Product.findById(req.params.id);
  if (!findInDb) {
    return res.status(404).send("Product Not Found");
  }

  // is admin want to add category?
  const adminId = await Account.findById(req.userId);
  // user exits or not?
  if (!adminId) {
    return req.send({
      status: false,
      error: "Not found any account to link with you:",
    });
  }

  if (adminId.who !== "admin") {
    return res
      .status(401)
      .send({
        status: false,
        error: "You have no permission to Edit This Product:",
      });
  }

  const updatedProdut = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: updateProdut },
    { new: true }
  );
  console.log("product is updateded:");
  res.send(updatedProdut);
});

//Route 2.4 : Delete Product using : Delete "/api/notes/fetchnotes"     ==> login require
router.delete(`/deleteProduct/:id`, fetchuser, async (req, res) => {
  // Find the Product to be deleted:
  let product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).send({status:false,error:"Product Not Found"});
  }

  // Note of current user or not:
  if (product.admin_id.toString() !== req.userId) {
    return res.status(401).send({status:false,error:"You can't change it"});
  }

  // Delete the note now:
  product = await Product.findByIdAndDelete(req.params.id);
  return res.send({status:true,msg:"Product is deleted successfully from db: "});

});

module.exports = router;
