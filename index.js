const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");

//? Import Routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");

//? Handle if file is not accepted by server
function errHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    res.json({
      success: 0,
      message: err.message,
    });
  }
}

//? PORT
var PORT = process.env.PORT || 3000;

//? Connect to DB
dotenv.config();

mongoose.connect(
  //@param process.env.DB_CONNECT is Key to access MongoDB
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("\x1b[36m%s\x1b[0m", "Connected to DB!")
);

//? Default Route
app.get("/", (req, res) => {
  res.json({
    success: 1,
    message: "Connect successfully to API",
  });
});

//? URL image
app.use("/profile", express.static("upload/images"));

app.use(errHandler);

//? Middleware
app.use(express.json());

//? Route Middleware
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);

//! We set port 9000 for Docker container
app.listen(PORT, () =>
  console.log("\x1b[36m%s\x1b[0m", `Server up and running at port: ${PORT}`)
);
