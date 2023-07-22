const httpStatus = require("http-status");

class SuccessResponse {
  static send(res, {
    message,
    statusCode = httpStatus.OK,
    metadata = {},
  }){
    return res.status(statusCode).json({
        status: 'success',
        message: !message ? httpStatus["200_MESSAGE"] : message,
        metadata
    })
  }
}


module.exports = SuccessResponse