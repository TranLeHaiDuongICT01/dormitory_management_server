const express = require("express");
const router = express.Router();

const bookingValidation = require("../../validations/booking.validation");
const validate = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");
const bookingController = require("../../controllers/booking.controller");

router
  .route("/")
  .get(
    auth("manage-booking"),
    validate(bookingValidation.getBookings),
    bookingController.getBookings
  );

router.post(
  "/request-booking",
  auth("request-booking"),
  validate(bookingValidation.requestBooking),
  bookingController.requestBooking
);

router.patch(
  "/accept-booking/:bookingId",
  auth("manage-booking"),
  validate(bookingValidation.acceptBooking),
  bookingController.acceptRequestBooking
);

router.patch(
  "/accept-payment/:bookingId",
  auth("manage-booking"),
  validate(bookingValidation.acceptPayment),
  bookingController.acceptPayment
);

router.patch(
  "/quit-room/:bookingId",
  auth("quit-room"),
  validate(bookingValidation.quitRoom),
  bookingController.quitRoom
);

router.patch(
  "/kick-out-room/:bookingId",
  auth("manage-booking"),
  validate(bookingValidation.quitRoom),
  bookingController.kickOutRoom
);

router.patch(
  "/cancel-booking/:bookingId",
  auth("manage-booking"),
  validate(bookingValidation.quitRoom),
  bookingController.cancelBookingByAdmin
);

router.patch(
  "/cancel/:bookingId",
  auth("cancel-booking"),
  validate(bookingValidation.quitRoom),
  bookingController.cancelBookingUser
);

router.get("/my-booking", auth("my-booking"), bookingController.getBookingUser);

module.exports = router;
