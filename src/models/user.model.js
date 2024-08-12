const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcryptjs'); // Erase if already required
const MODEL = require('../constants/models');

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatar: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['online', 'offline', 'away'],
      default: 'offline',
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, collection: MODEL.COLLECTION.USER },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (
  candidatePassword,
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

//Export the model
module.exports = mongoose.model(MODEL.DOCUMENT.USER, userSchema);
