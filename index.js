const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

//? Import Routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");

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

//? Middleware
app.use(express.json());

//? Route Middleware
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);

app.listen(PORT, () =>
  console.log("\x1b[36m%s\x1b[0m", "Server up and running at port: 3000")
);
