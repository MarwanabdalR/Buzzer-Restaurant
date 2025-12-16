import Joi from 'joi';

const phonePattern = /^\+?[0-9]{8,15}$/;

export const registerSchema = Joi.object({
  fullName: Joi.string().trim().min(3).required(),
  mobileNumber: Joi.string().trim().pattern(phonePattern).required(),
  idToken: Joi.string().required(),
});

export const loginSchema = Joi.object({
  idToken: Joi.string().required(),
});

