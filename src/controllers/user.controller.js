const httpStatus = require("http-status");
const UserService = require("../services/user.service");
const RoomService = require("../services/room.service");
const SuccessResponse = require("../utils/success");
const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");
const BookingService = require("../services/booking.service");

class UserController {
  createUser = catchAsync(async (req, res) => {
    const user = await UserService.createUser(req.body);
    SuccessResponse.send(res, {
      statusCode: httpStatus.CREATED,
      message: "Create new user successful",
      metadata: {
        user,
      },
    });
  });

  getUsers = catchAsync(async (req, res) => {
    const filter = pick(req.query, ["full_name", "role"]);
    const options = pick(req.query, ["sortBy", "limit", "page"]);
    const { results } = await UserService.queryUsers(filter, options);
    SuccessResponse.send(res, {
      message: "Get list user successful",
      metadata: {
        users: results,
      },
    });
  });

  getSummary = catchAsync(async (req, res) => {
    const { totalResults: totalUser } = await UserService.queryUsers({}, {});
    const { totalResults: totalRoom } = await RoomService.queryRooms({}, {});
    const { totalResults: totalBooking, results } = await BookingService.queryBookings(
      {},
      {populate: 'room'}
    );
    let totalPrice = 0
    results.forEach(el => {
      totalPrice += (el.months * el.room.price)
    });
    SuccessResponse.send(res, {
      message: "Get summary successful",
      metadata: {
        totalUser,
        totalRoom,
        totalBooking,
        totalPrice
      },
    });
  });

  getUser = catchAsync(async (req, res) => {
    const user = await UserService.getUserById(req.params.userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    SuccessResponse.send(res, {
      message: "Get user successful",
      metadata: {
        user,
      },
    });
  });

  updateUser = catchAsync(async (req, res) => {
    const user = await UserService.updateUserById(req.params.userId, req.body);
    SuccessResponse.send(res, {
      message: "Update user successful",
      metadata: {
        user,
      },
    });
  });

  deleteUser = catchAsync(async (req, res) => {
    await UserService.deleteUserById(req.params.userId);
    SuccessResponse.send(res, {
      message: "Delete user successful",
      metadata: {
        userId: req.params.userId,
      },
    });
  });
}

module.exports = new UserController();
