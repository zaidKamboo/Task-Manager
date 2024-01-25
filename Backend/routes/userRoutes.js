const express = require("express");
const router = express.Router();
const User = require("../Models/UserModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "This is a special secret token.";

//Toute 1 : Create a user using : POST "/api/auth/createuser".Doesn'st require login.
router.post("/signup", async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  //If there are errors return bad request and the errors.
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success, errors: errors.array(), message: errors.msg });
  }
  try {
    const body = req.body;
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(body.password, salt);
    const user = await User.create({
      name: body.name,
      password: secPass,
      email: body.email,
    });
    const authToken = jwt.sign({ user }, JWT_SECRET);
    const nuser = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
    success = true;
    return res.status(201).json({
      success,
      authToken,
      user: nuser,
      message: "Signed in successfully.",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success, message: error.message });
  }
});

//Route 2 : Logging in a user using : POST "/api/auth/login".Doesn'st require login.
router.post(
  "/login",
  [
    body("password", "Password must be atleast 5 characters").isLength({
      min: 6,
    }),
    body("email", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    //  if there are errors return bad request and the errors.
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success, errors: errors.array(), message: errors.msg });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success,
          message: "User not found.",
        });
      }
      const passwordcompare = await bcrypt.compare(password, user.password);
      if (!passwordcompare) {
        return res.status(400).json({
          success,
          message: "Please try to login with correct credentials",
        });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const nuser = {
        name: user.name,
        id: user._id,
        email: user.email,
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      return res.status(201).json({
        success,
        authToken,
        user: nuser,
        message: "Logged in successfully.",
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

module.exports = router;
