const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createBuilding = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
  }),
};

const updateBuilding = {
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
    })
    .min(1),
};

const getBuildings = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getBuilding = {
  params: Joi.object().keys({
    buildingId: Joi.string().custom(objectId),
  }),
};

const deleteBuilding = {
  params: Joi.object().keys({
    buildingId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createBuilding,
  updateBuilding,
  getBuildings,
  getBuilding,
  deleteBuilding
};
