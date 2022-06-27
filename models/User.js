const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Please provide a first name"],
    maxlength: 50,
    minlength: 3,
  },
  surname: {
    type: String,
    required: [true, "Please provide a last name"],
    maxlength: 50,
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
  },
  location: {
    type: String,
    required: [true, "Please provide a location(country)"],
  },
});

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10); // bigger the number the more random bytes
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method from Mongoose
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userID: this._id, name: this.firstname },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );
};

UserSchema.methods.username = function () {
  let randomNumber = Math.floor(Math.random() * 10_000);
  return this.firstname.slice(0, 3) + this.surname.slice(0, 3) + randomNumber;
};

UserSchema.methods.comparePassword = async function (currentPassword) {
  const isMatch = await bcrypt.compare(currentPassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
