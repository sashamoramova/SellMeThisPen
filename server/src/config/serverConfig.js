const express = require("express");
const morgan = require("morgan");
const removeHTTPHeader = require("../middleware/removeHeader");
const path = require("path");
const cors = require('cors');

const serverConfig = (app) => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(morgan("dev"));
  app.use(removeHTTPHeader);
  app.use("/static", express.static(path.resolve(__dirname, "..", "public")));
  app.use(cors());
};

module.exports = serverConfig;
