const express = require("express");
const router = express.Router();

const userController = require("../../controllers/user.controller");
const userValidation = require("../../validations/user.validation");
const validate = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");

router.get('/summary', auth('dashboard'), userController.getSummary)

router
  .route("/")
  .post(
    auth("manage-user"),
    validate(userValidation.createUser),
    userController.createUser
  )
  .get(
    auth("get-users"),
    validate(userValidation.getUsers),
    userController.getUsers
  );

router
  .route("/:userId")
  .get(
    auth("get-users"),
    validate(userValidation.getUser),
    userController.getUser
  )
  .patch(
    auth("manage-user"),
    validate(userValidation.updateUser),
    userController.updateUser
  )
  .delete(
    auth("manage-user"),
    validate(userValidation.deleteUser),
    userController.deleteUser
  );



module.exports = router;
