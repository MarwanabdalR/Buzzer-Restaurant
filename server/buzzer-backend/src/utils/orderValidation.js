import Joi from 'joi';

const orderItemSchema = Joi.object({
  productId: Joi.alternatives()
    .try(
      Joi.number().integer().positive().required(),
      Joi.string().pattern(/^\d+$/).required()
    )
    .messages({
      'alternatives.match': 'productId must be a valid positive integer',
      'any.required': 'productId is required',
      'number.base': 'productId must be a number',
      'number.integer': 'productId must be an integer',
      'number.positive': 'productId must be a positive number',
      'string.pattern.base': 'productId must be a numeric string',
    })
    .custom((value) => {
      return typeof value === 'string' ? parseInt(value, 10) : value;
    }),

  quantity: Joi.number()
    .integer()
    .positive()
    .min(1)
    .required()
    .messages({
      'number.base': 'quantity must be a number',
      'number.integer': 'quantity must be an integer',
      'number.positive': 'quantity must be greater than 0',
      'number.min': 'quantity must be at least 1',
      'any.required': 'quantity is required',
    }),
});

export const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(orderItemSchema)
    .min(1)
    .required()
    .messages({
      'array.base': 'items must be an array',
      'array.min': 'At least one item is required',
      'any.required': 'items array is required',
    }),

  location: Joi.string()
    .trim()
    .max(500)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'location must not exceed 500 characters',
    }),
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('PENDING', 'COMPLETED', 'CANCELLED')
    .required()
    .messages({
      'any.only': 'status must be one of: PENDING, COMPLETED, CANCELLED',
      'any.required': 'status is required',
    }),
});
