const nodemailer = require("nodemailer");
const config = require("../configs/config");
const moment = require("moment");

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== "test") {
  transport
    .verify()
    .then(() => console.info("Connected to email server"))
    .catch(() =>
      console.warn(
        "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
      )
    );
}

class EmailService {
  /**
   * Send an email
   * @param {string} to
   * @param {string} subject
   * @param {string} text
   * @returns {Promise}
   */
  static sendEmail = async (to, subject, text) => {
    const msg = { from: config.email.from, to, subject, text };
    await transport.sendMail(msg);
  };

  /**
   * Send reset password email
   * @param {string} to
   * @param {string} token
   * @returns {Promise}
   */
  static sendResetPasswordEmail = async (to, token) => {
    const subject = "Đặt lại mật khẩu";
    // replace this url with the link to the reset password page of your front-end app
    const resetPasswordUrl = `http://localhost:5173/reset-password?token=${token}`;
    const text = `Gửi bạn,
  Để đặt lại mật khẩu hãy nhấn vào link này: ${resetPasswordUrl}
  Nếu bạn không yêu cầu đặt lại mật khẩu hãy bỏ qua email này`;
    await this.sendEmail(to, subject, text);
  };

  /**
   * Send accept booking
   * @param {string} to
   * @param {string} bookingInfor
   * @returns {Promise}
   */
  static sendAcceptRequestBookingEmail = async (bookingInfor) => {
    const subject = "Yêu cầu đặt phòng của bạn đã được xác nhận";
    // replace this url with the link to the reset password page of your front-end app
    const text = `Gửi bạn,
    Yêu cầu đặt phòng của bạn đã được xác nhận
    Thông tin:
    - Tên sinh viên: ${bookingInfor.user.full_name}
    - Mã sinh viên: ${bookingInfor.user.code}
    - Lớp: ${bookingInfor.user.class_name}
    - Phòng đặt: ${bookingInfor.room.name}
    - Thời gian thuê phòng: ${bookingInfor.months} tháng
    - Số tiền cần thanh toán: ${bookingInfor.total_price}
    - Ngày bắt đầu: ${moment(bookingInfor.start_date).format("DD/MM/YYYY")}
    Vui lòng thực hiện thanh toán để hoàn tất việc đặt phòng
    Thông tin chuyển khoản:
     - Ngân hàng: Agribank
     - STK: XXXXXXXXXX
     - Nội dung chuyển khoản: ${bookingInfor.room.name} - ${
      bookingInfor.code_payment
    }
    Sau 3 ngày không thanh toán, yêu cầu của bạn sẽ tự động hủy
  `;
    await this.sendEmail(bookingInfor.user.email, subject, text);
  };

  static sendAcceptPaymentBookingEmail = async (bookingInfor) => {
    const subject = "Xác nhận thanh toán tiền phòng thành công";
    // replace this url with the link to the reset password page of your front-end app
    const text = `Gửi bạn,
    Chúng tôi đã nhận được thanh toán của bạn:
    Thông tin:
    - Tên sinh viên: ${bookingInfor.user.full_name}
    - Mã sinh viên: ${bookingInfor.user.code}
    - Lớp: ${bookingInfor.user.class_name}
    - Phòng đặt: ${bookingInfor.room.name}
    - Thời gian thuê phòng: ${bookingInfor.months} tháng
    - Số đã thanh toán: ${bookingInfor.total_price}
    - Ngày bắt đầu: ${moment(bookingInfor.start_date).format("DD/MM/YYYY")}
    - Ngày hết hạn: ${moment(bookingInfor.start_date).add(bookingInfor.months, 'months').format("DD/MM/YYYY")}
  `;
    await this.sendEmail(bookingInfor.user.email, subject, text);
  };

  static sendQuitRoomEmail = async (bookingInfor) => {
    const subject = "Xác nhận trả phòng thành công";
    // replace this url with the link to the reset password page of your front-end app
    const text = `Gửi bạn,
    Chúng tôi xác nhận bạn đã trả phòng thành công:
    Thông tin:
    - Tên sinh viên: ${bookingInfor.user.full_name}
    - Mã sinh viên: ${bookingInfor.user.code}
    - Lớp: ${bookingInfor.user.class_name}
    - Phòng đặt: ${bookingInfor.room.name}
    - Thời gian thuê phòng: ${bookingInfor.months} tháng
    - Số đã thanh toán: ${bookingInfor.total_price}
    - Ngày bắt đầu: ${moment(bookingInfor.start_date).format("DD/MM/YYYY")}
    - Ngày hết hạn: ${moment(bookingInfor.start_date).add(bookingInfor.months, 'months').format("DD/MM/YYYY")}
    - Ngày rời phòng: ${moment(bookingInfor.quit_date).format("DD/MM/YYYY")}
    - Lý do: ${bookingInfor.reason}
  `;
    await this.sendEmail(bookingInfor.user.email, subject, text);
  };

  static sendKickOutRoomEmail = async (bookingInfor) => {
    const subject = "Bạn đã bị đuổi khỏi phòng";
    // replace this url with the link to the reset password page of your front-end app
    const text = `Gửi bạn,
    Chúng tôi xin thông báo bạn đã bị đuổi khỏi phòng:
    Thông tin:
    - Tên sinh viên: ${bookingInfor.user.full_name}
    - Mã sinh viên: ${bookingInfor.user.code}
    - Lớp: ${bookingInfor.user.class_name}
    - Phòng đặt: ${bookingInfor.room.name}
    - Thời gian thuê phòng: ${bookingInfor.months} tháng
    - Số đã thanh toán: ${bookingInfor.total_price}
    - Ngày bắt đầu: ${moment(bookingInfor.start_date).format("DD/MM/YYYY")}
    - Ngày hết hạn: ${moment(bookingInfor.start_date).add(bookingInfor.months, 'months').format("DD/MM/YYYY")}
    - Ngày rời phòng: ${moment(bookingInfor.quit_date).format("DD/MM/YYYY")}
    - Lý do: ${bookingInfor.reason}
  `;
    await this.sendEmail(bookingInfor.user.email, subject, text);
  };

  static sendCancelBookingUserEmail = async (bookingInfor) => {
    const subject = "Bạn hủy yêu cầu thuê phòng";
    // replace this url with the link to the reset password page of your front-end app
    const text = `Gửi bạn,
    Chúng tôi xác nhận bạn đã hủy yêu cầu thuê phòng thành công:
    Thông tin:
    - Tên sinh viên: ${bookingInfor.user.full_name}
    - Mã sinh viên: ${bookingInfor.user.code}
    - Lớp: ${bookingInfor.user.class_name}
    - Phòng đặt: ${bookingInfor.room.name}
    - Thời gian thuê phòng: ${bookingInfor.months} tháng
    - Lý do: ${bookingInfor.reason}
  `;
    await this.sendEmail(bookingInfor.user.email, subject, text);
  };

  static sendCancelBookingByAdminEmail = async (bookingInfor) => {
    const subject = "Yêu cầu thuê phòng của bạn đã bị hủy";
    // replace this url with the link to the reset password page of your front-end app
    const text = `Gửi bạn,
    Chúng tôi Xin thông báo yêu cầu thuê phòng của bạn đã bị hủy:
    Thông tin:
    - Tên sinh viên: ${bookingInfor.user.full_name}
    - Mã sinh viên: ${bookingInfor.user.code}
    - Lớp: ${bookingInfor.user.class_name}
    - Phòng đặt: ${bookingInfor.room.name}
    - Thời gian thuê phòng: ${bookingInfor.months} tháng
    - Lý do: ${bookingInfor.reason}
  `;
    await this.sendEmail(bookingInfor.user.email, subject, text);
  };


  /**
   * Send verification email
   * @param {string} to
   * @param {string} token
   * @returns {Promise}
   */
  static sendVerificationEmail = async (to, token) => {
    const subject = "Email Verification";
    // replace this url with the link to the email verification page of your front-end app
    const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
    const text = `Dear user,
  To verify your email, click on this link: ${verificationEmailUrl}
  If you did not create an account, then ignore this email.`;
    await this.sendEmail(to, subject, text);
  };
}

module.exports = EmailService;
