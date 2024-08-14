const Conversation = require('../models/conversation.model');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getConversations = catchAsync(async (req, res) => {
  const conversations = await Conversation.find({
    participants: req.user._id,
  }).populate('participants', 'username avatar');
  res.status(200).json({
    status: 'success',
    data: conversations,
  });
});

exports.getConversation = catchAsync(async (req, res, next) => {
  const conversation = await Conversation.findOne({
    _id: req.params.id,
    participants: req.user._id,
  }).populate('participants', 'username avatar');
  if (!conversation) {
    return next(new AppError('Conversation not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: conversation,
  });
});

exports.createConversation = catchAsync(async (req, res) => {
  const participants = [req.user._id, ...req.body.participants];
  const conversation = await Conversation.create({
    participants,
    type: req.body.type,
    name: req.body.name,
  });
  res.status(201).json({
    status: 'success',
    data: conversation,
  });
});

exports.updateConversation = catchAsync(async (req, res, next) => {
  const conversation = await Conversation.findOne({
    _id: req.params.id,
    participants: req.user._id,
  });
  if (!conversation) {
    return next(new AppError('Conversation not found', 404));
  }
  conversation.name = req.body.name;
  await conversation.save();
  res.status(200).json({
    status: 'success',
    data: conversation,
  });
});

exports.deleteConversation = catchAsync(async (req, res, next) => {
  const conversation = await Conversation.findOneAndDelete({
    _id: req.params.id,
    participants: req.user._id,
  });
  if (!conversation) {
    return next(new AppError('Conversation not found', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
