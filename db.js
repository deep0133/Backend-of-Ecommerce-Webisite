const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/flipkart").then(()=>{
    console.log("successfully connected with mongoose:");
})