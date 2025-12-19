import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  description: Joi.string().allow('', null).optional(),
  price: Joi.number().positive().precision(2).required(),
  originalPrice: Joi.number().positive().precision(2).optional().allow(null),
  discountPercent: Joi.number().min(0).max(100).optional().allow(null),
  image: Joi.alternatives()
    .try(Joi.string().uri(), Joi.string().trim())
    .allow('', null)
    .optional(),
  images: Joi.alternatives()
    .try(Joi.array().items(Joi.string().uri()), Joi.string())
    .optional(),
  rate: Joi.number().min(0).max(5).optional(),
  isFeatured: Joi.boolean().optional().default(false),
  categoryId: Joi.number().integer().positive().required(),
  restaurantId: Joi.string().uuid().optional().allow(null),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(1).optional(),
  description: Joi.string().allow('', null).optional(),
  price: Joi.number().positive().precision(2).optional(),
  originalPrice: Joi.number().positive().precision(2).optional().allow(null),
  discountPercent: Joi.number().min(0).max(100).optional().allow(null),
  image: Joi.alternatives()
    .try(Joi.string().uri(), Joi.string().trim())
    .allow('', null)
    .optional(),
  images: Joi.alternatives()
    .try(Joi.array().items(Joi.string().uri()), Joi.string())
    .optional(),
  rate: Joi.number().min(0).max(5).optional(),
  isFeatured: Joi.boolean().optional(),
  categoryId: Joi.number().integer().positive().optional(),
  restaurantId: Joi.string().uuid().optional().allow(null),
}).min(1); // ensure at least one field is provided

