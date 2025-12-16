import Joi from 'joi';

/**
 * Phone number validation pattern
 * Supports international format: +[country code][number]
 * Example: +201234567890, +16505551234
 */
const phonePattern = /^\+?[0-9]{8,15}$/;

/**
 * Register Schema Validation
 * Validates fullName, mobileNumber, and idToken for user registration
 */
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

/**
 * Login Schema Validation
 * Validates idToken for user authentication
 */
export const loginSchema = Joi.object({
  idToken: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'ID token is required',
      'any.required': 'ID token is required',
    }),
});

/**
 * Update Profile Schema Validation
 * Validates fields for updating user profile
 */
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
    .email()
    .optional()
    .allow(null, '')
    .messages({
      'string.email': 'Email must be a valid email address',
    }),

  image: Joi.string()
    .trim()
    .uri()
    .optional()
    .allow(null, '')
    .messages({
      'string.uri': 'Image must be a valid URL',
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

