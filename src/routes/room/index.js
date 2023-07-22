const express = require("express");
const router = express.Router();

const roomValidation = require("../../validations/room.validation");
const validate = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");
const roomController = require("../../controllers/room.controller");

router
  .route("/")
  .post(
    auth("manage-room"),
    validate(roomValidation.createRoom),
    roomController.createRoom
  )
  .get(
    auth(),
    validate(roomValidation.getRooms),
    roomController.getRooms
  );

router
  .route("/:roomId")
  .patch(
    auth("manage-room"),
    validate(roomValidation.updateRoom),
    roomController.updateRoom
  )
  .get(
    auth(),
    validate(roomValidation.getRoom),
    roomController.getRoom
  )
  .delete(
    auth("manage-room"),
    validate(roomValidation.deleteRoom),
    roomController.deleteRoom
  )

module.exports = router;
