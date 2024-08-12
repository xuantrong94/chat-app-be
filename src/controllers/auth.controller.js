const catchAsync = require('../utils/catchAsync');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const {
  jwt: { key, expiresIn },
} = require('../configs/env.config');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, key, {
    expiresIn,
  });
};

const createSendToken = (user, statusCode, res) => {
  console.log('log1');
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  return res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.register = catchAsync(async (req, res) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return new AppError('Invalid email or password', 400);

});
