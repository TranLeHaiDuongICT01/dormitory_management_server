"use strict";

const httpStatus = require("http-status");
const AccessService = require("../services/access.service");
const TokenService = require("../services/token.service");
const catchAsync = require("../utils/catchAsync");
const SuccessResponse = require("../utils/success");
const EmailService = require("../services/email.service");
const UserService = require("../services/user.service");
const { roleRights } = require("../configs/roles");

class AccessController {
  signUp = catchAsync(async (req, res) => {
    const user = await AccessService.signUp(req.body);
    const tokens = await TokenService.generateAuthTokens(user);
    const permissions = roleRights.get(user.role)
    SuccessResponse.send(res, {
      statusCode: httpStatus.CREATED,
      message: "Register new user successful",
      metadata: {
        user,
        tokens,
        permissions
      },
    });
  });
  signIn = catchAsync(async (req, res) => {
    const user = await AccessService.signIn(req.body);
    const tokens = await TokenService.generateAuthTokens(user);
    const permissions = roleRights.get(user.role)
    SuccessResponse.send(res, {
      message: "Login successful",
      metadata: {
        user,
        tokens,
        permissions
      },
    });
  });
  logout = catchAsync(async (req, res) => {
    await AccessService.logout(req.body);
    SuccessResponse.send(res, {
      message: "Logout successful",
    });
  });
  refreshTokens = catchAsync(async (req, res) => {
    const tokens = await AccessService.refreshAuth(req.body.refreshToken);
    SuccessResponse.send(res, {
      message: "Refresh token successful",
      metadata: { ...tokens },
    });
  });
  forgotPassword = catchAsync(async (req, res) => {
    const resetPasswordToken = await TokenService.generateResetPasswordToken(
      req.body.email
    );
    await EmailService.sendResetPasswordEmail(
      req.body.email,
      resetPasswordToken
    );
    SuccessResponse.send(res, {
      message: "Please check your email!",
    });
  });
  resetPassword = catchAsync(async (req, res) => {
    await AccessService.resetPassword(req.query.token, req.body.password);
    SuccessResponse.send(res, {
      message: "Reset password successful!",
    });
  });
  changePassword = catchAsync(async (req, res) => {
    await AccessService.changePassword(
      req.user,
      req.body.oldPassword,
      req.body.password
    );
    SuccessResponse.send(res, {
      message: "Change password successful!",
    });
  });
  updateProfile = catchAsync(async (req, res) => {
    const user = await UserService.updateUserById(req.user.id, req.body);
    SuccessResponse.send(res, {
      message: "Update information successful",
      metadata: {
        user,
      },
    });
  });
}

module.exports = new AccessController();
