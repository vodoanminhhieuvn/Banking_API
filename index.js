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
// app.set("views", __dirname + "/views");
// app.engine("html", require("ejs").renderFile);

// app.set("view engine", "ejs");

// app.get("/hello", (req, res) => {
//   res.write("index.html");
// });
app.use(express.static(__dirname + "/public"));

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
