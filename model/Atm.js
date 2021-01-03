const mongoose = require("mongoose");

const atmSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  currentCash: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Atm", atmSchema);
