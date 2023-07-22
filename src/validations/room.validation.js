const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createRoom = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    max_people: Joi.number().required(),
    price: Joi.number().required(),
    building: Joi.string().custom(objectId),
  }),
};

const updateRoom = {
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      max_people: Joi.number(),
      price: Joi.number()
    })
    .min(1),
};

const getRooms = {
  query: Joi.object().keys({
    name: Joi.string(),
    building: Joi.string(),
    sortBy: Joi.string(),
    populate: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getRoom = {
  params: Joi.object().keys({
    roomId: Joi.string().custom(objectId),
  }),
};

const deleteRoom = {
  params: Joi.object().keys({
    roomId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createRoom,
  updateRoom,
  getRooms,
  getRoom,
  deleteRoom,
};
