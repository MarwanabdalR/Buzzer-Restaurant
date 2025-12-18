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

export const updateProfileSchema = Joi.object({
  fullName: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Full name must be at least 3 characters long',
      'string.max': 'Full name must not exceed 100 characters',
    }),

  email: Joi.string()
    .trim()
    .optional()
    .allow(null, '')
    .custom((value, helpers) => {
      if (!value || value === '') return null;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(value)) {
        return value;
      }
      return helpers.error('string.custom', { message: 'Email must be a valid email address' });
    })
    .messages({
      'string.custom': 'Email must be a valid email address',
    }),

  image: Joi.string()
    .trim()
    .optional()
    .allow(null, '')
    .custom((value, helpers) => {
      if (!value || value === '') return value;
      if (value.startsWith('data:image/') || value.startsWith('http://') || value.startsWith('https://')) {
        return value;
      }
      return helpers.error('string.custom', { message: 'Image must be a valid URL or base64 data URL' });
    })
    .messages({
      'string.custom': 'Image must be a valid URL or base64 data URL',
    }),

  mobileNumber: Joi.string()
    .trim()
    .pattern(phonePattern)
    .optional()
    .messages({
      'string.pattern.base': 'Mobile number must be in international format (e.g., +201234567890)',
    }),

  type: Joi.string()
    .valid('user', 'admin')
    .optional()
    .messages({
      'any.only': 'type must be either "user" or "admin"',
    }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});
