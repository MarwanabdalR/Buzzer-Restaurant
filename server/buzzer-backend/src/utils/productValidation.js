import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  description: Joi.string().allow('', null).optional(),
  price: Joi.number().positive().precision(2).required(),
  image: Joi.alternatives()
    .try(Joi.string().uri(), Joi.string().trim())
    .allow('', null)
    .optional(),
  rate: Joi.number().min(0).max(5).optional(),
  categoryId: Joi.number().integer().positive().required(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(1).optional(),
  description: Joi.string().allow('', null).optional(),
  price: Joi.number().positive().precision(2).optional(),
  image: Joi.alternatives()
    .try(Joi.string().uri(), Joi.string().trim())
    .allow('', null)
    .optional(),
  rate: Joi.number().min(0).max(5).optional(),
  categoryId: Joi.number().integer().positive().optional(),
}).min(1); // ensure at least one field is provided

