"use strict";

const mongoose = require("mongoose"); // Erase if already required
const toJSON = require("./plugins/toJSON.plugin");
const paginate = require("./plugins/paginate.plugin");

// Declare the Schema of the Mongo model
var booking = new mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    room: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Room",
      required: true,
    },
    months: {
      type: Number,
      require: true,
    },
    status: {
      type: String,
      default: "WAITING",
    },
    start_date: {
      type: Date
    },
    total_price: {
      type: Number
    },
    reason: {
      type: String
    },
    code_payment: {
      type: String
    },
    quit_date: {
      type: Date
    }
  },
  {
    timestamps: true,
  }
);

booking.plugin(toJSON);
booking.plugin(paginate);

/**
 * @typedef Booking
 */
const Booking = mongoose.model("Booking", booking);

//Export the model
module.exports = Booking;
