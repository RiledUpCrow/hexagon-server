import { RegisterEngineMessage } from '../EngineMessage';
import Joi from 'joi';

const parseRegisterMessage = (message: any): RegisterEngineMessage => {
  const schema = Joi.object().keys({
    type: Joi.string()
      .equal('register')
      .required(),
    data: Joi.object()
      .keys({
        id: Joi.string()
          .token()
          .required(),
        adminToken: Joi.string()
          .token()
          .required(),
        version: Joi.string().required(),
      })
      .required(),
  });

  const { error, value } = schema.validate(message);

  if (error) {
    throw new Error('Invalid message');
  }

  return value;
};

export default parseRegisterMessage;
