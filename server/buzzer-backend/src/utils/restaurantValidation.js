import Joi from 'joi';

export const createRestaurantSchema = Joi.object({
  name: Joi.string().trim().min(1).max(200).required().messages({
    'string.empty': 'Restaurant name is required',
    'string.min': 'Restaurant name must be at least 1 character',
    'string.max': 'Restaurant name must not exceed 200 characters',
    'any.required': 'Restaurant name is required',
  }),
  type: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'Restaurant type is required',
    'string.min': 'Restaurant type must be at least 1 character',
    'string.max': 'Restaurant type must not exceed 100 characters',
    'any.required': 'Restaurant type is required',
  }),
  location: Joi.string().trim().min(1).max(500).required().messages({
    'string.empty': 'Location is required',
    'string.min': 'Location must be at least 1 character',
    'string.max': 'Location must not exceed 500 characters',
    'any.required': 'Location is required',
  }),
  rating: Joi.number().min(0).max(5).default(0).messages({
    'number.base': 'Rating must be a number',
    'number.min': 'Rating must be at least 0',
    'number.max': 'Rating must not exceed 5',
  }),
  imageUrl: Joi.alternatives()
    .try(Joi.string().uri(), Joi.string().trim())
    .allow('', null)
    .optional()
    .messages({
      'string.uri': 'Image URL must be a valid URI',
    }),
});

export const updateRestaurantSchema = Joi.object({
  name: Joi.string().trim().min(1).max(200).optional().messages({
    'string.min': 'Restaurant name must be at least 1 character',
    'string.max': 'Restaurant name must not exceed 200 characters',
  }),
  type: Joi.string().trim().min(1).max(100).optional().messages({
    'string.min': 'Restaurant type must be at least 1 character',
    'string.max': 'Restaurant type must not exceed 100 characters',
  }),
  location: Joi.string().trim().min(1).max(500).optional().messages({
    'string.min': 'Location must be at least 1 character',
    'string.max': 'Location must not exceed 500 characters',
  }),
  rating: Joi.number().min(0).max(5).optional().messages({
    'number.base': 'Rating must be a number',
    'number.min': 'Rating must be at least 0',
    'number.max': 'Rating must not exceed 5',
  }),
  imageUrl: Joi.alternatives()
    .try(Joi.string().uri(), Joi.string().trim())
    .allow('', null)
    .optional()
    .messages({
      'string.uri': 'Image URL must be a valid URI',
    }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

