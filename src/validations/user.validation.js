const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    full_name: Joi.string().required(),
    code: Joi.string(),
    date_of_birth: Joi.date().required(),
    class_name: Joi.string(),
    role: Joi.string().valid("USER", "MANAGER", "ADMIN"),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    full_name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      full_name: Joi.string(),
      code: Joi.string(),
      date_of_birth: Joi.date(),
      class_name: Joi.string(),
      role: Joi.string().valid("USER", "MANAGER", "ADMIN"),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
