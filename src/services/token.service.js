"use strict";

const config = require("../configs/config");
const { tokenTypes } = require("../configs/tokens");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const Token = require("../models/token.model");
const UserService = require("./user.service");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

class TokenService {
  static generateToken = (
    userId,
    expires,
    type,
    secret = config.jwt.secret
  ) => {
    const payload = {
      sub: userId,
      iat: moment().unix(),
      exp: expires.unix(),
      type,
    };
    return jwt.sign(payload, secret);
  };

  /**
   * Save a token
   * @param {string} token
   * @param {ObjectId} userId
   * @param {Moment} expires
   * @param {string} type
   * @param {boolean} [blacklisted]
   * @returns {Promise<Token>}
   */
  static saveToken = async (
    token,
    userId,
    expires,
    type,
    blacklisted = false
  ) => {
    const tokenDoc = await Token.create({
      token,
      user: userId,
      expires: expires.toDate(),
      type,
      blacklisted,
    });
    return tokenDoc;
  };

  /**
   * Generate auth tokens
   * @param {User} user
   * @returns {Promise<Object>}
   */
  static generateAuthTokens = async (user) => {
    const accessTokenExpires = moment().add(
      config.jwt.accessExpirationMinutes,
      "minutes"
    );
    const accessToken = this.generateToken(
      user.id,
      accessTokenExpires,
      tokenTypes.ACCESS
    );

    const refreshTokenExpires = moment().add(
      config.jwt.refreshExpirationDays,
      "days"
    );
    const refreshToken = this.generateToken(
      user.id,
      refreshTokenExpires,
      tokenTypes.REFRESH
    );
    await this.saveToken(
      refreshToken,
      user.id,
      refreshTokenExpires,
      tokenTypes.REFRESH
    );

    return {
      accessToken,
      refreshToken,
    };
  };
  /**
   * Verify token and return token doc (or throw an error if it is not valid)
   * @param {string} token
   * @param {string} type
   * @returns {Promise<Token>}
   */
  static verifyToken = async (token, type) => {
    const payload = jwt.verify(token, config.jwt.secret);
    const tokenDoc = await Token.findOne({
      token,
      type,
      user: payload.sub,
      blacklisted: false,
    });
    if (!tokenDoc) {
      throw new Error("Token not found");
    }
    return tokenDoc;
  };
  /**
   * Generate reset password token
   * @param {string} email
   * @returns {Promise<string>}
   */
  static generateResetPasswordToken = async (email) => {
    const user = await UserService.getUserByEmail(email);
    if (!user) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "No users found with this email"
      );
    }
    const expires = moment().add(
      config.jwt.resetPasswordExpirationMinutes,
      "minutes"
    );
    const resetPasswordToken = this.generateToken(
      user.id,
      expires,
      tokenTypes.RESET_PASSWORD
    );
    await this.saveToken(
      resetPasswordToken,
      user.id,
      expires,
      tokenTypes.RESET_PASSWORD
    );
    return resetPasswordToken;
  };
  /**
   * Generate verify email token
   * @param {User} user
   * @returns {Promise<string>}
   */
  static generateVerifyEmailToken = async (user) => {
    const expires = moment().add(
      config.jwt.verifyEmailExpirationMinutes,
      "minutes"
    );
    const verifyEmailToken = this.generateToken(
      user.id,
      expires,
      tokenTypes.VERIFY_EMAIL
    );
    await this.saveToken(
      verifyEmailToken,
      user.id,
      expires,
      tokenTypes.VERIFY_EMAIL
    );
    return verifyEmailToken;
  };
}

module.exports = TokenService;
