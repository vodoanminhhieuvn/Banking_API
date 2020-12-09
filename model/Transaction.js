const mongoose = require("mongoose");

const transactionDetailSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  fund: {
    type: Number,
    required: true,
  },
  cardId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

transactionDetailSchema.pre("save", function (next) {
  now = new Date();
  this.date = now;
  next();
});

module.exports = mongoose.model("TransactionDetail", transactionDetailSchema);
