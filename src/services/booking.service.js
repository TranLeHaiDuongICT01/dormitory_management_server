const httpStatus = require("http-status");
const Booking = require("../models/booking.model");
const ApiError = require("../utils/ApiError");
const RoomService = require("./room.service");
const EmailService = require("./email.service");
const moment = require('moment')

class BookingService {
  /**
   * Create a booking
   * @param {Object} bookingBody
   * @returns {Promise<Booking>}
   */
  static createBooking = async (bookingBody) => {
    const room = await RoomService.getRoomById(bookingBody.room);
    if (!room) {
      throw new ApiError(httpStatus.NOT_FOUND, "Không tìm thấy phòng");
    }
    let current_people = await this.getCurrentPeople(bookingBody.room);
    const listBooked = await this.queryBookings(
      {
        user: bookingBody.user,
        status: { $in: ["WAITING", "WAITING_PAYMENT", "SUCCESS_PAYMENT"] },
      },
      {}
    );
    if (current_people >= room.max_people) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Phòng đã đầy, vui lòng chọn phòng khác."
      );
    }
    if (listBooked.totalResults > 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Bạn đã đặt phòng rồi");
    }

    const total_price = room.price * bookingBody.months;

    return await Booking.create({ ...bookingBody, total_price });
  };
  /**
   * Query for bookings
   * @param {Object} filter - Mongo filter
   * @param {Object} options - Query options
   * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @returns {Promise<QueryResult>}
   */
  static queryBookings = async (filter, options) => {
    const bookings = await Booking.paginate(filter, options);
    return bookings;
  };
  /**
   * Update booking by id
   * @param {ObjectId} bookingId
   * @param {Object} updateBody
   * @returns {Promise<Booking>}
   */
  static updateBookingById = async (bookingId, updateBody) => {
    const booking = await this.getBookingById(bookingId);
    if (!booking) {
      throw new ApiError(httpStatus.NOT_FOUND, "Booking not found");
    }
    Object.assign(booking, updateBody);
    await booking.save();
    return booking;
  };
  /**
   * Get booking by id
   * @param {ObjectId} id
   * @returns {Promise<Booking>}
   */
  static getBookingById = async (id) => {
    return Booking.findById(id).populate("user room");
  };
  static getBookingByUser = async (userId) => {
    const booking = await Booking.findOne({
      user: userId,
      status: { $in: ["WAITING", "WAITING_PAYMENT", "SUCCESS_PAYMENT"] },
    }).populate("user room");
    if (booking && booking.status === "WAITING_PAYMENT") {
      const isExpired =
        new Date().getTime() - new Date(booking.start_date).getTime() >=
        86400000 * 3;
      if (isExpired) {
        booking.status = "CANCLED";
        booking.reason = "Quá hạn thanh toán tiền phòng";
        await booking.save();
        await EmailService.sendCancelBookingByAdminEmail(booking);
      }
    }
    if (booking && booking.status === "SUCCESS_PAYMENT") {
      const isExpired =
        new Date().getTime() -
          new Date(
            moment(booking.start_date).add(booking.months, "months")
          ).getTime() >=
        0;
      if (isExpired) {
        booking.status = "WAITING_PAYMENT";
        await booking.save();
      }
    }
    return booking;
  };
  static checkBookingExpiredPayment = async (bookings) => {
    for (const booking of bookings) {
      if (booking && booking.status === "WAITING_PAYMENT") {
        const isExpired =
          new Date().getTime() - new Date(booking.start_date).getTime() >=
          86400000 * 3;
        if (isExpired) {
          booking.status = "CANCLED";
          booking.reason = "Quá hạn thanh toán tiền phòng";
          await booking.save();
          await EmailService.sendCancelBookingByAdminEmail(booking);
        }
      }
      if (booking && booking.status === "SUCCESS_PAYMENT") {
        const isExpired =
          new Date().getTime() -
            new Date(
              moment(booking.start_date).add(booking.months, "months")
            ).getTime() >=
          0;
        if (isExpired) {
          booking.status = "WAITING_PAYMENT";
          await booking.save();
        }
      }
    }
    return bookings;
  };
  static getCurrentPeople = async (roomId) => {
    let current_people = 0;
    const { results } = await this.queryBookings({ room: roomId }, {});
    results.forEach((rs) => {
      if (rs.status === "WAITING_PAYMENT" || rs.status === "SUCCESS_PAYMENT") {
        current_people++;
      }
    });
    return current_people;
  };
  static acceptPayment = async (bookingId) => {
    const booking = await this.getBookingById(bookingId);
    console.log(booking);
    if (booking.status !== "WAITING_PAYMENT") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Yêu cầu không hợp lệ.");
    }
    booking.reason = "";
    booking.status = "SUCCESS_PAYMENT";
    await booking.save();
    return booking;
  };
  static quitRoom = async (bookingId, reason) => {
    const booking = await this.getBookingById(bookingId);
    if (booking.status !== "SUCCESS_PAYMENT") {
      throw new ApiError(httpStatus.BAD_REQUEST, "Yêu cầu không hợp lệ.");
    }
    booking.reason = reason;
    booking.status = "QUITTED";
    booking.quit_date = new Date();
    await booking.save();
    return booking;
  };
  static kickOutRoom = async (bookingId, reason) => {
    const booking = await this.getBookingById(bookingId);
    if (
      booking.status !== "SUCCESS_PAYMENT" &&
      booking.status === "WAITING_PAYMENT"
    ) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Yêu cầu không hợp lệ.");
    }
    booking.reason = reason;
    booking.status = "KICKED";
    booking.quit_date = new Date();
    await booking.save();
    return booking;
  };
  static cancelBookingUser = async (bookingId, reason) => {
    const booking = await this.getBookingById(bookingId);
    if (
      booking.status !== "SUCCESS_PAYMENT" &&
      booking.status === "WAITING_PAYMENT"
    ) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Yêu cầu không hợp lệ.");
    }
    booking.reason = reason;
    booking.status = "CANCELED";
    await booking.save();
    return booking;
  };
}

module.exports = BookingService;
