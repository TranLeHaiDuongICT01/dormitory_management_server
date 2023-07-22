const express = require("express");
const router = express.Router();

const buildingValidation = require("../../validations/building.validation");
const validate = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");
const buildingController = require("../../controllers/building.controller");

router
  .route("/")
  .post(
    auth("manage-building"),
    validate(buildingValidation.createBuilding),
    buildingController.createBuilding
  )
  .get(
    auth(),
    validate(buildingValidation.getBuildings),
    buildingController.getBuildings
  );

router
  .route("/:buildingId")
  .patch(
    auth("manage-building"),
    validate(buildingValidation.updateBuilding),
    buildingController.updateBuilding
  )
  .get(
    auth(),
    validate(buildingValidation.getBuilding),
    buildingController.getBuilding
  )
  .delete(
    auth("manage-building"),
    validate(buildingValidation.deleteBuilding),
    buildingController.deleteBuilding
  )

module.exports = router;
