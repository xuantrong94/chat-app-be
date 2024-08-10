const mongoose = require('mongoose'); // Erase if already required
const MODEL = require('../constants/models');

// Declare the Schema of the Mongo model
var conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: MODEL.DOCUMENT.USER,
      },
    ],
    type: {
      type: String,
      enum: ['private', 'group'],
      default: 'private',
    },
    name: {
      type: String,
      trim: true,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MODEL.DOCUMENT.MESSAGE,
    },
    lastMessageDate: {
      type: Date,
      default: Date.now,
    },
    unreadMessages: {
      type: Number,
      default: 0,
    },
    isTyping: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MODEL.DOCUMENT.USER,
    },
    typing: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: MODEL.DOCUMENT.USER,
      },
    ],
  },
  {
    timestamps: true,
    collection: MODEL.COLLECTION.CONVERSATION,
  },
);

//Export the model
module.exports = mongoose.model(
  MODEL.DOCUMENT.CONVERSATION,
  conversationSchema,
);
