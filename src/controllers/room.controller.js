const httpStatus = require("http-status");
const SuccessResponse = require("../utils/success");
const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");
const RoomService = require("../services/room.service");
const BookingService = require("../services/booking.service");

class RoomController {
  createRoom = catchAsync(async (req, res) => {
    const room = await RoomService.createRoom(req.body);
    SuccessResponse.send(res, {
      statusCode: httpStatus.CREATED,
      message: "Create new room successful",
      metadata: {
        room,
      },
    });
  });
  updateRoom = catchAsync(async (req, res) => {
    const room = await RoomService.updateRoomById(req.params.roomId, req.body);
    SuccessResponse.send(res, {
      message: "Update room successful",
      metadata: {
        room,
      },
    });
  });
  getRooms = catchAsync(async (req, res) => {
    const filter = pick(req.query, ["name", "building"]);
    const options = pick(req.query, ["sortBy", "limit", "page", "populate"]);
    const { results } = await RoomService.queryRooms(filter, options);
    for (let room of results) {
      const current_people = await BookingService.getCurrentPeople(room.id);
      room.current_people = current_people;
      await room.save();
    }
    SuccessResponse.send(res, {
      message: "Get list room successful",
      metadata: {
        rooms: results,
      },
    });
  });
  getRoom = catchAsync(async (req, res) => {
    const room = await RoomService.getRoomById(req.params.roomId);
    if (!room) {
      throw new ApiError(httpStatus.NOT_FOUND, "Room not found");
    }
    const current_people = await BookingService.getCurrentPeople(room.id);
    room.current_people = current_people;
    await room.save();
    SuccessResponse.send(res, {
      message: "Get room successful",
      metadata: {
        room,
      },
    });
  });
  deleteRoom = catchAsync(async (req, res) => {
    await RoomService.deleteRoomById(req.params.roomId);
    SuccessResponse.send(res, {
      message: "Delete room successful",
      metadata: {
        roomId: req.params.roomId,
      },
    });
  });
}

module.exports = new RoomController();
