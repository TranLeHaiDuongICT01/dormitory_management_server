"use strict";

const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const UserService = require("./user.service");
const Token = require("../models/token.model");
const { tokenTypes } = require("../configs/tokens");
const TokenService = require("./token.service");

class AccessService {
  /**
   * Register new user
   * @param {string} email
   * @param {string} password
   * @param {string} full_name
   * @param {string} code
   * @param {string} date_of_birth
   * @param {string} class_name
   * @returns {Promise<User>}
   */
  static signUp = async ({
    full_name,
    email,
    password,
    code,
    date_of_birth,
    class_name,
  }) => {
    const newUser = await UserService.createUser({
      full_name,
      email,
      password,
      date_of_birth,
      class_name,
      code,
    });
    return newUser;
  };
  /**
   * Login with username and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<User>}
   */
  static signIn = async ({ email, password }) => {
    const user = await UserService.getUserByEmail(email);
    if (!user || !(await user.isPasswordMatch(password))) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Incorrect email or password"
      );
    }
    return user;
  };
  /**
   * Logout
   * @param {string} refreshToken
   * @returns {Promise}
   */
  static logout = async ({ refreshToken }) => {
    const refreshTokenDoc = await Token.findOne({
      token: refreshToken,
      type: tokenTypes.REFRESH,
      blacklisted: false,
    });
    if (!refreshTokenDoc) {
      throw new ApiError(httpStatus.NOT_FOUND, "Not found");
    }
    await refreshTokenDoc.deleteOne();
  };
  /**
   * Refresh auth tokens
   * @param {string} refreshToken
   * @returns {Promise<Object>}
   */
  static refreshAuth = async (refreshToken) => {
    try {
      const refreshTokenDoc = await TokenService.verifyToken(
        refreshToken,
        tokenTypes.REFRESH
      );
      const user = await UserService.getUserById(refreshTokenDoc.user);
      if (!user) {
        throw new Error();
      }
      await refreshTokenDoc.deleteOne();
      return TokenService.generateAuthTokens(user);
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
    }
  };
  /**
   * Reset password
   * @param {string} resetPasswordToken
   * @param {string} newPassword
   * @returns {Promise}
   */
  static resetPassword = async (resetPasswordToken, newPassword) => {
    try {
      const resetPasswordTokenDoc = await TokenService.verifyToken(
        resetPasswordToken,
        tokenTypes.RESET_PASSWORD
      );
      const user = await UserService.getUserById(resetPasswordTokenDoc.user);
      if (!user) {
        throw new Error();
      }
      await UserService.updateUserById(user.id, { password: newPassword });
      await Token.deleteMany({
        user: user.id
      });
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Password reset failed");
    }
  };
  /**
   * Change password
   * @param {string} refreshToken
   * @param {string} oldPassword
   * @param {string} newPassword
   * @returns {Promise}
   */
  static changePassword = async (user, oldPassword, newPassword) => {
      const isMatchPass = await user.isPasswordMatch(oldPassword)
      if (!isMatchPass) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "Incorrect old password"
        );
      }
      // console.log(user);
      await UserService.updateUserById(user.id, { password: newPassword });
  }
}

module.exports = AccessService;
