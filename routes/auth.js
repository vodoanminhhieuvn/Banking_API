const router = require("express").Router();
const User = require("../model/User");
const Card = require("../model/Card");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verify = require("./verifyToken");
const multer = require("multer");
const path = require("path");

const {
  registerValidation,
  loginValidation,
  cardValidation,
  cardLoginValidation,
} = require("../validation");

//? Register Route
router.post("/register", async (req, res) => {
  //? VALIDATE DATA BEFORE WE A USER
  //? Check clients requests
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //? Checking if the user is exist
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  //? Check password1 = password2
  if (req.body.password1 != req.body.password2)
    return res.status(400).send("Password doesn't match");

  //? Hash the passwords
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password1, salt);

  //? Create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: hashPassword,
  });

  try {
    const saveUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

//? Login Route

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //? Checking if the user is exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email is wrong");

  //? Password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Password is wrong");

  //? Create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  // res.header("auth-token", token).send(token);

  //? Send back Token Json
  res.send({ Token: token });
});

//? Card create
router.post("/card-create", async (req, res) => {
  const { error } = cardValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //? Checking if the user is exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("User is not exist");

  //? Checking if the user already had card
  const checkCard = await Card.findOne({ userId: user._id });
  if (checkCard) return res.status(400).send("User already had card");

  //? Hash the PIN
  const salt = await bcrypt.genSalt(10);
  const hashPIN = await bcrypt.hash(req.body.PIN, salt);

  //? Create new card
  const card = new Card({
    _id: req.body._id,
    userId: user._id,
    balance: req.body.balance,
    PIN: hashPIN,
  });

  try {
    const saveCard = await card.save();
    res.send({ cardId: card._id, PIN: hashPIN });
  } catch (err) {
    res.status(400).send(err);
  }
});

//? Card login
router.post("/card-login", async (req, res) => {
  const { error } = cardLoginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //? Check if card is exist
  const card = await Card.findOne({ _id: req.body.cardId });
  if (!card) return res.status(400).send("Card is not exist");

  //? Check if PIN is exist
  const validPIN = await bcrypt.compare(req.body.PIN, card.PIN);
  if (!validPIN) return res.status(400).send("PIN is wrong");

  //? Create and assign a token
  const cardToken = jwt.sign({ _id: card._id }, process.env.TOKEN_SECRET);

  //? Decode Token
  const userID = jwt.decode(cardToken)._id;
  //? Send back Token Json
  res.send({ Token: cardToken, userID: userID });
});

//? Upload Image Route
//TODO CREATE DIFFERENT UPLOAD

const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 9000000 },
});

router.get("/upload", upload.single("profile"), async (req, res) => {
  // console.log(req.file.fileName);
  res.json({
    success: 1,
    profile_url: `http://localhost:9000/profile/${req.file.filename}`,
  });
});

module.exports = router;
