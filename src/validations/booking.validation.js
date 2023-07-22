const Joi = require("joi");
const { objectId } = require("./custom.validation");

const requestBooking = {
  body: Joi.object().keys({
    // userId: Joi.string().custom(objectId).required(),
    room: Joi.string().custom(objectId).required(),
    months: Joi.number().required(),
  }),
};

const getBookings = {
  query: Joi.object().keys({
    status: Joi.string(),
    populate: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const acceptBooking = {
  params: Joi.object().keys({
    bookingId: Joi.string().custom(objectId),
  }),
};

const acceptPayment = {
  params: Joi.object().keys({
    bookingId: Joi.string().custom(objectId),
  }),
};

const quitRoom = {
  params: Joi.object().keys({
    bookingId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    reason: Joi.string().required(),
  }),
};

module.exports = {
  requestBooking,
  getBookings,
  acceptBooking,
  acceptPayment,
  quitRoom
};
