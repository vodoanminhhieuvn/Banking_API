const mongoose = require("mongoose");

const transactionDetailSchema = new mongoose.Schema({
  fund: {
    type: String,
    required: true,
  },
  cardId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("TransactionDetail", transactionDetailSchema);
