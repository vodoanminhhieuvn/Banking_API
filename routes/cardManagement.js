const router = require("express").Router();
const verify = require("./verifyToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Card = require("../model/Card");

const { transactionDetailValidation } = require("../validation");

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
  const balance = await (parseInt(req.body.fund) +
    parseInt(cardReceive.balance));

  const deduction = await (parseInt(cardSend.balance) -
    parseInt(req.body.fund));

  cardReceive.balance = balance;
  cardReceive.save();

  cardSend.balance = deduction;
  cardSend.save();

  return res.send({
    balance: cardReceive.balance,
    cardSend_balance: cardSend.balance,
  });
});

module.exports = router;
