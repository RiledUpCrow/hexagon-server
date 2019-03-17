import Joi from 'joi';

export const emailConstraint = Joi.string().email();
export const nameConstraint = Joi.string()
  .alphanum()
  .min(3)
  .max(16);
export const passwordConstraint = Joi.string()
  .alphanum()
  .min(8)
  .max(64);
