const jwt = require("jsonwebtoken");

// secret key:  dotenv package:SEC_KEY
const s_key = "secret_key";
//process.env.sec_key

// fetchuser middleware :
const fetchuser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(404).send({success:false, error: "Login again" });
  }

  try {
    const data = jwt.verify(token, s_key);
    req.userId = data.userId;
    next();
  } catch (error) {
    res.status(401).send({success:false, error: "Please enter the valid token: ?" });
  }
};

module.exports = fetchuser;