import Joi from 'joi';

const phonePattern = /^\+?[0-9]{8,15}$/;

export const registerSchema = Joi.object({
  fullName: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Full name is required',
      'string.min': 'Full name must be at least 3 characters long',
      'string.max': 'Full name must not exceed 100 characters',
      'any.required': 'Full name is required',
    }),
  
  mobileNumber: Joi.string()
    .trim()
    .pattern(phonePattern)
    .required()
    .messages({
      'string.empty': 'Mobile number is required',
      'string.pattern.base': 'Mobile number must be in international format (e.g., +201234567890)',
      'any.required': 'Mobile number is required',
    }),
  
  idToken: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'ID token is required',
      'any.required': 'ID token is required',
    }),
});

export const loginSchema = Joi.object({
  idToken: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'ID token is required',
      'any.required': 'ID token is required',
    }),
});

