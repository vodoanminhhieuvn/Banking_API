const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
  },
  PIN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Card", cardSchema);
