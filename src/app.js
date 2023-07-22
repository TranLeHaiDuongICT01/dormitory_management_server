require("dotenv").config();
const express = require("express");
const app = express();

const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const passport = require("passport");
const config = require("./configs/config");
const { jwtStrategy } = require("./configs/passport");
const { authLimiter } = require("./middlewares/rateLimiter");
const { errorConverter, errorHandler } = require("./middlewares/error");
const httpStatus = require("http-status");
const ApiError = require("./utils/ApiError");

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// enable cors
app.use(cors());
app.options("*", cors());

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);
// init db
require("./dbs/init.mongodb");

// limit repeated failed requests to auth endpoints
if (config.env === "production") {
  app.use("/api/v1/auth", authLimiter);
}

// init routes
app.use("", require("./routes"));

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
