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
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

const cardValidation = (data) => {
  const schema = Joi.object({
    _id: Joi.string().required().length(16),
    balance: Joi.number().min(0),
    PIN: Joi.string()
      .regex(/^[0-9]+$/)
      .length(6)
      .required()
      .messages({
        "string.pattern.base": "Invalid PIN number",
      }),
    email: Joi.string().min(6).required().email(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.cardValidation = cardValidation;
