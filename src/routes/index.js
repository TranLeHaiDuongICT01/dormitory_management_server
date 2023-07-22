"use strict";

const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "OK",
  });
});

router.use("/api/v1/auth", require("./access"));

router.use("/api/v1/user", require("./user"));

router.use("/api/v1/building", require("./building"));

router.use("/api/v1/room", require("./room"));

router.use("/api/v1/booking", require("./booking"));

module.exports = router;
