const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  // Optional as already got mongoose validators
  const { firstname, surname, email, password } = req.body;
  if (!firstname || !surname || !email || !password) {
    throw new BadRequestError("Please provide a name, email and password");
  }

  //   Hashing the Password - handled as 'pre' inside of the user schema (User model file)

  const user = await User.create({ ...req.body });
  const token = user.createJWT(); // Instance method in the model file

  res.status(StatusCodes.CREATED).json({ user, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide a email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const token = user.createJWT(); // Instance method in the model file
  res.status(StatusCodes.OK).json({ user, token });
};

module.exports = {
  register,
  login,
};
