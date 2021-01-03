const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  cardId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  expire_at: { type: Date, default: Date.now, expires: 10 },
});

module.exports = mongoose.model("Notification", notificationSchema);
