const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const multer = require("multer");

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
//? Default Route

//? PORT
var PORT = process.env.PORT || 9000;

//? Connect to DB
dotenv.config();

mongoose.connect(
  //@param process.env.DB_CONNECT is Key to access MongoDB
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("\x1b[36m%s\x1b[0m", "Connected to DB!")
);

//? Default Route
app.use(express.static(__dirname + "/public"));
app.get("/api", (req, res) => {
  res.json({
    success: 1,
    message: "Connected to API",
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
//! run docker build -t node-docker-api .
//! run docker run -it -p 9000:9000 -v ${pwd}:/app node-docker-api
app.listen(PORT, () =>
  console.log("\x1b[36m%s\x1b[0m", `Server up and running at port: ${PORT}`)
);
