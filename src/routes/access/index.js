const express = require("express");
const router = express.Router();

const accessController = require("../../controllers/access.controller");
const authValidation = require("../../validations/auth.validation");
const validate = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");

router.post(
  "/signup",
  validate(authValidation.register),
  accessController.signUp
);
router.post("/signin", validate(authValidation.login), accessController.signIn);
router.post(
  "/signout",
  validate(authValidation.logout),
  accessController.logout
);
router.post(
  "/refresh-token",
  validate(authValidation.refreshTokens),
  accessController.refreshTokens
);

router.post(
  "/forgot-password",
  validate(authValidation.forgotPassword),
  accessController.forgotPassword
);

router.post(
  "/reset-password",
  validate(authValidation.resetPassword),
  accessController.resetPassword
);

router.patch(
  "/change-password",
  auth(),
  validate(authValidation.changePassword),
  accessController.changePassword
);

router.patch(
  "/update-profile",
  auth(),
  validate(authValidation.updateProfile),
  accessController.updateProfile
);

module.exports = router;
