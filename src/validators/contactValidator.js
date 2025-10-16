const Joi = require('joi');

exports.createContactSchema = Joi.object({
  name: Joi.string().min(1).required(),
  phone: Joi.string().min(5).required(),
  email: Joi.string().email().required(),
  notes: Joi.string().allow(null, '')
});
