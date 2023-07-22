"use strict";

const mongoose = require("mongoose"); // Erase if already required
const toJSON = require("./plugins/toJSON.plugin");
const paginate = require("./plugins/paginate.plugin");

// Declare the Schema of the Mongo model
var buildingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: {
        type: String,
        required: true
      }
  },
  {
    timestamps: true,
  }
);

buildingSchema.plugin(toJSON);
buildingSchema.plugin(paginate);

buildingSchema.statics.isNameTaken = async function (name, excludeId) {
  const building = await this.findOne({ name, _id: { $ne: excludeId } }).lean()
  return !!building;
};

/**
 * @typedef Building
 */
const Building = mongoose.model("Building", buildingSchema);


//Export the model
module.exports = Building;
