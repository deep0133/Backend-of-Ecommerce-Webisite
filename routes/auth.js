const express = require("express");
const router = express.Router();
const Account = require("../Models/Account.js");
const Profile = require("../Models/Profile.js");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../Middleware/fetchuser.js");

const s_key = "secret_key";

//Route 1 :  creating user using : Post "/api/auth/createUser"     ==> without login
router.post("/createAccount",
  [
    body("number", "Enter the valid phone number:").isLength({
      min: 10,
      max: 10,
    }),
    body("password", "password should be greater than 4 characters:").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      // if there are errors return bad request and errors:
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: errors.array() });
      }

      // check : user exit with this number or not.  => findOne  function match all email of document with given email.
      let user = await Account.findOne({ number: req.body.number });
      if (user) {
        return res
          .status(400)
          .json({
            success: false,
            error:[{
              msg: "Sorry user with this number is alredy exit:",
            }]
          });
      }

      const salt = bcrypt.genSaltSync(10);
      const secPass = bcrypt.hashSync(req.body.password, salt);

      // create new user now and save it in data base:
      user = await Account.create({
        number: req.body.number,
        password: secPass,
      });

      // Profile making and storing in data base:
      profileCreating = await Profile.create({
        user_id: user._id,
        number: user.number,
      });

      const authToken = jwt.sign({ userId: user._id }, s_key);
      console.log(authToken);

      res.json({ success: true, authToken });
    } catch (err) {
      console.log("deepanshuHeer error see here : " + err);
      res.status(500).send({ success: false, error: `Some error occured:` });
    }
  }
);

//Route 2 : user login using : Post "/api/auth/login"     ==> without login
router.post("/login",
  [
    body("number", "Enter the valid number:").isLength({ min: 10, max: 10 }),
    body("password", "password should be greater than 4 characters:").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      // if there are errors return bad request and errors:  in email and password condition:
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      // check : user exit with this email or not.  => findOne  function match all email of document with given email.
      let user = await Account.findOne({ number: req.body.number });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, errors:[{
              msg:  "Invalid Credentials:"
            }]
          })
          
      }

      const compareToPassword = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!compareToPassword) {
        console.log("password not match:");
        return res
          .status(400)
          .json({ success: false, error: "Invalid Credentials: pass" });
      }
      console.log("password matched ||  in sign process");
      const authToken = jwt.sign({ userId: user._id }, s_key);
      console.log(authToken);

      if (user.who === "admin") {
        res.json({
          success: true,
          admin: "Admin login Successfully:",
          authToken: authToken,
        });
      } else {
        res.json({ success: true, authToken: authToken });
      }
    } catch (err) {
      console.log("deepanshuHeer error see here : " + err);
      res.status(500).send({ success: false, error: `Some error occured:` });
    }
  }
);

//Route 3 :  updating a user profile  : Post "/api/auth/profile"     ==> after login done
router.put(`/updateprofile/:id`, fetchuser, async (req, res) => {
  try {
    // Creating New profile :
    const newProfile = {};

    if (req.body.profile_url) {
      newProfile.profile_url = req.body.profile_url;
    }
    if (req.body.fname) {
      newProfile.fname = req.body.fname;
    }
    if (req.body.lname) {
      newProfile.lname = req.body.lname;
    }
    if (req.body.email) {
      newProfile.email = req.body.email;
    }
    if (req.body.number) {
      newProfile.number = req.body.number;
    }
    if (req.body.gender) {
      newProfile.gender = req.body.gender;
    }

    // Find the profile to be updated:
    let pro_data = await Profile.findById(req.params.id);

    if (!pro_data) {
      return res.status(404).send({status:false,error:"User Profile Not Found"});
    }

    if (pro_data.user_id.toString() !== req.userId) {
      return res.status(401).send({success:false,error:"You can't change it"});
    }
    
    // updating file in db:
    let profileUpdating = await Profile.findByIdAndUpdate(req.params.id,{$set:newProfile},{new:true});

    return res.send({ success: true, data:profileUpdating });

  } catch (err) {
    console.log("Try Agian : " + err);
    return res.status(500).send({ success: false, error: `Some error occured : Try Again` });
  }
});

//Route 4 : getuser using : Post "/api/auth/getuser"     ==> login require
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    // now fetch data of user profile: with the help of user id:
    let user = await Profile.findOne({user_id:req.userId});

    res.send(user);
  } catch (error) {
    res.status(401).send({success:false, error:"Please Try Again After Some Time"});
  }
});

module.exports = router;
