const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const Building = require("../models/building.model");
const RoomService = require("./room.service");
const BookingService = require("./booking.service");

class BuildingService {
  /**
   * Create a building
   * @param {Object} buildingBody
   * @returns {Promise<Building>}
   */
  static createBuilding = async (buildingBody) => {
    const isNameExisted = await Building.isNameTaken(buildingBody.name);
    if (isNameExisted) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Name building already taken");
    }
    return await Building.create(buildingBody);
  };
  /**
   * Update building by id
   * @param {ObjectId} buildingId
   * @param {Object} updateBody
   * @returns {Promise<Building>}
   */
  static updateBuildingById = async (buildingId, updateBody) => {
    const building = await this.getBuildingById(buildingId);
    if (!building) {
      throw new ApiError(httpStatus.NOT_FOUND, "Building not found");
    }
    if (
      updateBody.name &&
      (await Building.isNameTaken(updateBody.name, buildingId))
    ) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Name already taken");
    }
    Object.assign(building, updateBody);
    await building.save();
    return building;
  };
  /**
   * Get building by id
   * @param {ObjectId} id
   * @returns {Promise<Building>}
   */
  static getBuildingById = async (id) => {
    return Building.findById(id);
  };
  /**
   * Query for buildings
   * @param {Object} filter - Mongo filter
   * @param {Object} options - Query options
   * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @returns {Promise<QueryResult>}
   */
  static queryBuildings = async (filter, options) => {
    const buildings = await Building.paginate(filter, options);
    return buildings;
  };
  /**
   * Delete building by id
   * @param {ObjectId} buildingId
   * @returns {Promise<Building>}
   */
  static deleteBuildingById = async (buildingId) => {
    // const { results } = await RoomService.queryRooms(
    //   { building: buildingId },
    //   {}
    // );
    // for (const room of results) {
    //   const { totalResults } = await BookingService.queryBookings(
    //     {
    //       room: room.id,
    //       status: { $in: ["WAITING", "WAITING_PAYMENT", "SUCCESS_PAYMENT"] },
    //     },
    //     {}
    //   );
    //   if (totalResults > 0) {
    //     throw new ApiError(httpStatus.BAD_REQUEST, "Có phòng đang có người ở");
    //   }
    // }
    const building = await this.getBuildingById(buildingId);
    if (!building) {
      throw new ApiError(httpStatus.NOT_FOUND, "Building not found");
    }
    await building.deleteOne();
    return building;
  };
}

module.exports = BuildingService;
