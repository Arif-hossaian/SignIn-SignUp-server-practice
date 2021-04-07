import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    unique: true,
    require: true,
  },
  phone: {
    type: Number,
    unique: true,
    require: true,
  },
  work: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
    trim: true,
  },
  cpassword: {
    type: String,
    require: true,
    trim: true,
  },
  tokens: [
    {
      token: {
        type: String,
        require: true,
      },
    },
  ],
});

//Passwording Hashing
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    this.cpassword = await bcrypt.hash(this.cpassword, 10);
  }
  next();
});

//generating JSON-WEB-TOKEN
userSchema.methods.generateAuthToken = async function () {
  try {
    const tokenCreation = jwt.sign(
      {
        _id: this._id,
      },
      process.env.SECRET_KEY
    );
    this.tokens = this.tokens.concat({ token: tokenCreation });
    await this.save();
    return tokenCreation;
  } catch (error) {
    console.log(error);
  }
};

export default mongoose.model("User", userSchema);
