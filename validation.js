//? VALIDATION
const Joi = require("@hapi/joi");

//? Register Validation
//? Mapping data requests
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().min(6).required().email(),
    phone: Joi.string()
      .regex(/^[0-9]+$/)
      .min(10)
      .max(16)
      .required()
      .messages({
        "string.min": `phone should have a minimum length of {#limit}`,
        "string.max": `phone should have a maximum length of {#limit}`,
        "string.pattern.base": "Invalid phone number",
      }),
    password1: Joi.string().min(6).required(),
    password2: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

const cardValidation = (data) => {
  const schema = Joi.object({
    _id: Joi.string()
      .regex(/^[0-9]+$/)
      .required()
      .length(16)
      .messages({
        "string.empty": "Card id can not be empty",
        "string.length": "Card id must be contain 16 character",
        "string.pattern.base": "Invalid ID number",
      }),
    balance: Joi.number().min(0),
    PIN: Joi.string()
      .regex(/^[0-9]+$/)
      .length(6)
      .required()
      .messages({
        "string.pattern.base": "Invalid PIN number",
      }),
    email: Joi.string().email().min(6).required(),
  });
  return schema.validate(data);
};

const cardLoginValidation = (data) => {
  const schema = Joi.object({
    cardId: Joi.string()
      .regex(/^[0-9]+$/)
      .required()
      .length(16)
      .messages({
        "string.empty": "Card id can not be empty",
        "string.length": "Card id must be contain 16 character",
        "string.pattern.base": "Invalid ID number",
      }),
    PIN: Joi.string()
      .regex(/^[0-9]+$/)
      .required()
      .length(6)
      .messages({
        "string.empty": "Card id can not be empty",
        "string.length": "Card id must be contain 6 character",
        "string.pattern.base": "Invalid ID number",
      }),
  });
  return schema.validate(data);
};

const transactionDetailValidation = (data) => {
  const schema = Joi.object({
    fund: Joi.number().required(),
    cardId: Joi.string()
      .regex(/^[0-9]+$/)
      .required()
      .length(16)
      .messages({
        "string.empty": "Card id can not be empty",
        "string.length": "Card id must be contain 16 character",
        "string.pattern.base": "Invalid ID number",
      }),
  });
  return schema.validate(data);
};

const transactionValidation = (data) => {
  const schema = Joi.object({
    fund: Joi.number().required(),
  });
  return schema.validate(data);
};

const requestCardValidation = (data) => {
  const schema = Joi.object({
    type: Joi.string().required(),
    cardId: Joi.string().required(),
    date: Date.now(),
  });
  return schema.validate(data);
};

// const atmValidation = (data) => {
//   const schema = Joi.object({
//     location: Joi.string().required(),
//     currentCash: Joi.number().required(),
//   });
//   return schema.validate(data);
// };

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.cardValidation = cardValidation;
module.exports.cardLoginValidation = cardLoginValidation;
module.exports.transactionDetailValidation = transactionDetailValidation;
module.exports.transactionValidation = transactionValidation;
module.exports.requestCardValidation = requestCardValidation;
