import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Register-section
export const signup = async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;
  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(400).json({
      msg: "Plz Fill up all the field",
    });
  }

  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    } else if (password != cpassword) {
      return res.status(400).json({
        message: "Password are not matching",
      });
    } else {
      //creating new user if that user is not exists in Database
      const newUser = new User({
        name,
        email,
        phone,
        work,
        password,
        cpassword,
      });
      await newUser.save();
      res.status(201).json({
        msg: "User registration succesfull",
      });
    }
  } catch (error) {
    res.status(500).json({ msg: `${error} occured` });
  }
};

//Login-section
export const signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      msg: "Plz Fill up all the field",
    });
  }
  try {
    const oldUserLogin = await User.findOne({ email });
    // console.log(oldUserLogin);
    const isMatchPassword = await bcrypt.compare(
      password,
      oldUserLogin.password
    );
    //JWT-section
    const token = await oldUserLogin.generateAuthToken();
    // console.log(token);
    res.cookie("jsontoken", token, {
      expires: new Date(Date.now() + 3600000),
      httpsOnly: true
    })
    if (!isMatchPassword) {
      return res.status(404).json({ msg: "Invalid credential" });
    } else {
      return res.status(200).json({ msg: "User Sign-In Succesfull" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
