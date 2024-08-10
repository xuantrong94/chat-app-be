const mongoose = require('mongoose'); // Erase if already required
const MODEL = require('../constants/models');
// Declare the Schema of the Mongo model
var messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MODEL.DOCUMENT.CONVERSATION,
      require: [true, 'Conversation is required'],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: MODEL.COLLECTION.USER,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      enum: ['text', 'image', 'video', 'audio', 'file'],
      default: 'text',
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: MODEL.DOCUMENT.USER,
      },
    ],
  },
  { timestamps: true, collection: MODEL.COLLECTION.MESSAGE },
);

//Export the model
module.exports = mongoose.model(MODEL.DOCUMENT.MESSAGE, messageSchema);
