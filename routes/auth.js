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

//? Card login
router.post("/card-create", async (req, res) => {
  const { error } = cardValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //? Checking if the user is exist
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).json({ success: 0, error: "User is not exist" });

  //? Create new card
  const card = new Card({
    _id: req.body._id,
    userId: user._id,
    balance: req.body.balance,
    PIN: req.body.PIN,
  });

  try {
    const saveCard = await card.save();
    res.send({ cardId: card._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

//? Upload Image Route
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

router.get("/upload", upload.single("profile"), verify, async (req, res) => {
  res.json({
    success: 1,
    profile_url: `http://localhost:9000/profile/${req.file.filename}`,
  });
});

module.exports = router;
