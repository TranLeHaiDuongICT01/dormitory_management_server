const httpStatus = require("http-status");
const BookingService = require("../services/booking.service");
const catchAsync = require("../utils/catchAsync");
const SuccessResponse = require("../utils/success");
const pick = require("../utils/pick");
const { random10Digits } = require("../utils/number");
const EmailService = require("../services/email.service");
const BuildingService = require("../services/building.service");

class BookingController {
  requestBooking = catchAsync(async (req, res) => {
    await BookingService.createBooking({ ...req.body, user: req.user.id });
    SuccessResponse.send(res, {
      statusCode: httpStatus.CREATED,
      message: "Request booking room successful",
    });
  });
  getBookings = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['status']);
    const options = pick(req.query, ["sortBy", "limit", "page", "populate"]);
    const { results } = await BookingService.queryBookings(filter, options);
    const bookings = await BookingService.checkBookingExpiredPayment(results);
    SuccessResponse.send(res, {
      message: "Get list booking successful",
      metadata: {
        bookings: bookings,
      },
    });
  });
  getBookingUser = catchAsync(async (req, res) => {
    const booking = await BookingService.getBookingByUser(req.user.id);
    const building = await BuildingService.getBuildingById(booking?.room?.building)
    SuccessResponse.send(res, {
      message: "Get booking successful",
      metadata: {
        booking,
        building
      },
    });
  });
  acceptRequestBooking = catchAsync(async (req, res) => {
    const booking = await BookingService.updateBookingById(
      req.params.bookingId,
      {
        status: "WAITING_PAYMENT",
        start_date: new Date(),
        code_payment: random10Digits(),
      }
    );
    await EmailService.sendAcceptRequestBookingEmail(booking);
    SuccessResponse.send(res, {
      message: "Accept request booking room successful",
    });
  });
  acceptPayment = catchAsync(async (req, res) => {
    const booking = await BookingService.acceptPayment(req.params.bookingId);
    await EmailService.sendAcceptPaymentBookingEmail(booking);
    SuccessResponse.send(res, {
      message: "Xác nhận thanh toán thành công!",
    });
  });
  quitRoom = catchAsync(async (req, res) => {
    const booking = await BookingService.quitRoom(req.params.bookingId, req.body.reason);
    await EmailService.sendQuitRoomEmail(booking);
    SuccessResponse.send(res, {
      message: "Rời phòng thành công!",
    });
  });
  kickOutRoom = catchAsync(async (req, res) => {
    const booking = await BookingService.kickOutRoom(req.params.bookingId, req.body.reason);
    await EmailService.sendKickOutRoomEmail(booking);
    SuccessResponse.send(res, {
      message: "Đuổi thành công!",
    });
  });
  cancelBookingUser = catchAsync(async (req, res) => {
    const booking = await BookingService.cancelBookingUser(req.params.bookingId, req.body.reason);
    await EmailService.sendCancelBookingUserEmail(booking);
    SuccessResponse.send(res, {
      message: "Hủy thành công!",
    });
  });
  cancelBookingByAdmin = catchAsync(async (req, res) => {
    const booking = await BookingService.cancelBookingUser(req.params.bookingId, req.body.reason);
    await EmailService.sendCancelBookingByAdminEmail(booking);
    SuccessResponse.send(res, {
      message: "Hủy thành công!",
    });
  });
}

module.exports = new BookingController();
