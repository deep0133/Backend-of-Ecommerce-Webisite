const express = require("express");
const cors = require("cors")

const db = require("./db");         // connected to data base:   
const app = express();
app.use(cors())

const port = 5000;

app.use(express.json())

app.use(`/api/auth`, require("./routes/auth")); 
app.use(`/api/product`, require("./routes/product")); 
app.use(`/api/order`, require("./routes/order")); 

app.listen(port, () => {
  console.log("i am listening at port : "+port);
});