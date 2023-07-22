const httpStatus = require("http-status");
const Room = require("../models/room.model");
const ApiError = require("../utils/ApiError");

class RoomService {
  /**
   * Create a room
   * @param {Object} roomBody
   * @returns {Promise<Room>}
   */
  static createRoom = async (roomBody) => {
    return await Room.create(roomBody);
  };
  /**
   * Update room by id
   * @param {ObjectId} roomId
   * @param {Object} updateBody
   * @returns {Promise<Room>}
   */
  static updateRoomById = async (roomId, updateBody) => {
    const room = await this.getRoomById(roomId);
    if (!room) {
      throw new ApiError(httpStatus.NOT_FOUND, "Room not found");
    }
    Object.assign(room, updateBody);
    await room.save();
    return room;
  };
  /**
   * Get room by id
   * @param {ObjectId} id
   * @returns {Promise<Room>}
   */
  static getRoomById = async (id) => {
    return Room.findById(id).populate("building");
  };
  /**
   * Query for rooms
   * @param {Object} filter - Mongo filter
   * @param {Object} options - Query options
   * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @returns {Promise<QueryResult>}
   */
  static queryRooms = async (filter, options) => {
    const rooms = await Room.paginate(filter, options);
    return rooms;
  };
  /**
   * Delete room by id
   * @param {ObjectId} roomId
   * @returns {Promise<Room>}
   */
  static deleteRoomById = async (roomId) => {
    // const {totalResults} = await BookingService.queryBookings(
    //   {
    //     room: roomId,
    //     status: { $in: ["WAITING", "WAITING_PAYMENT", "SUCCESS_PAYMENT"] },
    //   },
    //   {}
    // );
    // if(totalResults > 0){
    //   throw new ApiError(httpStatus.BAD_REQUEST, "Phòng đang có người ở");
    // }
    const room = await this.getRoomById(roomId);
    if (!room) {
      throw new ApiError(httpStatus.NOT_FOUND, "Room not found");
    }
    await room.deleteOne();
    return room;
  };
}

module.exports = RoomService;
