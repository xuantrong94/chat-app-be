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
  const token = signToken(user._id);
  const cookieOptions = {
    expire: new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000),
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

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Invalid email or password', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  if (!(await user.comparePassword(password))) {
    return next(new AppError('Invalid email or password', 400));
  }
  user.lastSeen = Date.now();
  user.status = 'online';
  await user.save({ validateBeforeSave: false });

  createSendToken(user, 200, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  const user = req.user;
  user.status = 'offline';
  await user.save({ validateBeforeSave: false });
  res.clearCookie('jwt');

  return res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  const jwtToken =
    req.cookies.jwt || req.headers.authorization?.split(' ')[1];
  if (!jwtToken) {
    return next(new AppError('No token provided', 401));
  }
  const decoded = jwt.verify(jwtToken, key);
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  req.user = user;
  next();
});
