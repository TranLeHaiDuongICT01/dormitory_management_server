"use strict";

const mongoose = require("mongoose"); // Erase if already required
const toJSON = require("./plugins/toJSON.plugin");
const paginate = require("./plugins/paginate.plugin");

// Declare the Schema of the Mongo model
var roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    max_people: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    current_people: {
      type: Number,
      default: 0
    },
    building: {
      type: mongoose.Types.ObjectId,
      ref: 'Building'
    }
  },
  {
    timestamps: true,
  }
);

roomSchema.plugin(toJSON);
roomSchema.plugin(paginate);

/**
 * @typedef Room
 */
const Room = mongoose.model("Room", roomSchema);

//Export the model
module.exports = Room;
