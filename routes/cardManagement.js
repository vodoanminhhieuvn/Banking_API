const router = require("express").Router();
const verify = require("./verifyToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Card = require("../model/Card");
const TransactionDetail = require("../model/Transaction");

const {
  transactionDetailValidation,
  transactionValidation,
} = require("../validation");

router.post("/send-money", verify, async (req, res) => {
  //? VALIDATE DATA BEFORE WE A USER
  //? Check clients requests

  const { error } = transactionDetailValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //? decode token
  const token = req.header("auth-token");
  const cardSendID = jwt.decode(token)._id;

  //? Checking if cards are the sane
  if (cardSendID === req.body.cardId)
    return res.status(400).send("You can not send money to yourself");

  //? Checking if card is exist
  const cardReceive = await Card.findOne({ _id: req.body.cardId });
  if (!cardReceive) return res.status(400).send("Card is not exist");

  // //? Decode Token
  const cardSend = await Card.findOne({ _id: jwt.decode(token)._id });

  //? Checking user balance and fund
  if (req.body.fund % 1000 != 0 || req.body.fund > cardSend.balance)
    return res.status(400).send("Fund is not valid");

  //? Update cards balance
  const balance = await (parseFloat(req.body.fund) +
    parseFloat(cardReceive.balance));

  const deduction = await (parseFloat(cardSend.balance) -
    parseFloat(req.body.fund));

  cardReceive.balance = balance;
  cardReceive.save();

  cardSend.balance = deduction;
  cardSend.save();

  //? Save transaction history to transaction detail
  const transaction = new TransactionDetail({
    type: "Transfer",
    fund: req.body.fund,
    cardId: cardSendID,
  });

  await transaction.save();

  return res.send({
    balance: cardReceive.balance,
    cardSend_balance: cardSend.balance,
  });
});

router.post("/withdraw", async (req, res) => {
  const { error } = transactionValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const token = req.header("auth-token");
  const moneyAmount = req.body.fund;
  const cardReceivedId = jwt.decode(token)._id;

  if (!cardReceivedId) res.status(400).send("Wrong cardId");

  const cardReceived = await Card.findOne({ _id: cardReceivedId });
  if (!cardReceived) return res.status(400).send("Wrong card");

  if (cardReceived.balance < moneyAmount) {
    res.status(400).send("Not enough money");
  }

  if (moneyAmount % 10000 === 0) {
    const moneyReceived = await (parseFloat(cardReceived.balance) -
      parseFloat(moneyAmount));

    cardReceived.balance = moneyReceived;
    cardReceived.save();

    const transaction = new TransactionDetail({
      type: "Withdrawal",
      fund: req.body.fund,
      cardId: cardReceived,
    });

    await transaction.save();

    return res.send({
      message: "Send money success",
      balance: cardReceived.balance,
    });
  } else {
    res.status(400).send("Invalid amount");
  }
});

router.post("/deposit", verify, async (req, res) => {
  const { error } = transactionValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const token = req.header("auth-token");
  const moneyAmount = req.body.fund;
  const cardReceivedId = jwt.decode(token)._id;

  if (!cardReceivedId) res.status(400).send("Wrong cardId");

  const cardReceived = await Card.findOne({ _id: cardReceivedId });
  if (!cardReceived) return res.status(400).send("Wrong card");

  if (moneyAmount % 10000 === 0) {
    const moneyReceived = await (parseFloat(moneyAmount) +
      parseFloat(cardReceived.balance));

    cardReceived.balance = moneyReceived;
    cardReceived.save();

    const transaction = new TransactionDetail({
      type: "Deposit",
      fund: req.body.fund,
      cardId: cardReceivedId,
    });

    await transaction.save();

    return res.send({
      message: "Send money success",
      balance: cardReceived.balance,
    });
  } else {
    res.status(400).send("Invalid amount");
  }
});

router.get("/transaction", verify, async (req, res) => {
  const cardToken = req.header("auth-token");
  const currentCardId = jwt.decode(cardToken)._id;

  //@param Sorting transaction by Date Ascending
  const transactionsDateAsc = await TransactionDetail.find({
    cardId: currentCardId,
  }).sort({ date: 1 });

  //@param Sorting transaction by Date Descending
  const transactionDateDsc = await TransactionDetail.find({
    cardId: currentCardId,
  }).sort({ date: -1 });

  //@param Sorting transaction by Amount Ascending
  const transactionFundAsc = await TransactionDetail.find({
    cardId: currentCardId,
  }).sort({ fund: 1 });

  //@param Sorting transaction by Amount Descending
  const transactionFundDsc = await TransactionDetail.find({
    cardId: currentCardId,
  }).sort({ fund: -1 });

  res.send({
    dateASC: transactionsDateAsc,
    dateDSC: transactionDateDsc,
    fundASC: transactionFundAsc,
    fundDSC: transactionFundDsc,
  });
});

router.get("/transaction/:filterType", verify, async (req, res) => {
  const cardToken = req.header("auth-token");
  const currentCardId = jwt.decode(cardToken)._id;

  const filterType = req.params.filterType;

  const transactionsDateAsc = await TransactionDetail.find({
    cardId: currentCardId,
    type: filterType,
  }).sort({ date: 1 });
  const transactionDateDsc = await TransactionDetail.find({
    cardId: currentCardId,
    type: filterType,
  }).sort({ date: -1 });

  const transactionFundAsc = await TransactionDetail.find({
    cardId: currentCardId,
    type: filterType,
  }).sort({ fund: 1 });
  const transactionFundDsc = await TransactionDetail.find({
    cardId: currentCardId,
    type: filterType,
  }).sort({ fund: -1 });

  res.send({
    dateASC: transactionsDateAsc,
    dateDSC: transactionDateDsc,
    fundASC: transactionFundAsc,
    fundDSC: transactionFundDsc,
  });
});

module.exports = router;
