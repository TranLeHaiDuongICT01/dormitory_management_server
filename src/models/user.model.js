"use strict";

const mongoose = require("mongoose"); // Erase if already required
const toJSON = require("./plugins/toJSON.plugin");
const bcrypt = require('bcrypt')
const { roles } = require('../configs/roles');
const paginate = require("./plugins/paginate.plugin");

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
      index: true,
    },
    code: {
      type: String,
      default: ''
    },
    class_name: {
      type: String
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    date_of_birth: {
      type: Date,
    },
    password: {
      type: String,
      required: true,
      private: true
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      private: true
    },
    role: {
      type: String,
      enum: roles,
      default: "USER",
      // private: true
    },
  },
  {
    timestamps: true
  }
);

userSchema.plugin(toJSON)
userSchema.plugin(paginate)

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } }).lean()
  return !!user;
};

userSchema.statics.isCodeTaken = async function (code, excludeUserId) {
  const user = await this.findOne({ code, _id: { $ne: excludeUserId } }).lean()
  return !!user;
};

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

//Export the model
module.exports = User
