// Validation schemas using Joi
import Joi from 'joi';

export const categorySchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  // Image is optional; can be a URL or omitted when using file uploads
  image: Joi.alternatives()
    .try(Joi.string().uri(), Joi.string().trim())
    .allow('', null)
    .optional(),
});

