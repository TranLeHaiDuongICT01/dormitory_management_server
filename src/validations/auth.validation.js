const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    full_name: Joi.string().required(),
    code: Joi.string().required(),
    date_of_birth: Joi.date().required(),
    class_name: Joi.string().required(),
    // full_name: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    oldPassword: Joi.string().required(),
    password: Joi.string().required().custom(password),
  }),
};


const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const updateProfile = {
  body: Joi.object().keys({
    full_name: Joi.string(),
    code: Joi.string(),
    date_of_birth: Joi.date(),
    class_name: Joi.string(),
    email: Joi.string().email()
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  changePassword,
  updateProfile
};