import { RpcException } from '@nestjs/microservices';

export const validationPipeConfig = {
  transform: true,
  stopAtFirstError: true,
  exceptionFactory: (errors) => {
    const errorsForResponse = [];
    errors.forEach((e) => {
      const constraintsKeys = Object.keys(e.constraints);
      // constraintsKeys.forEach((key) => {
      //   errorsForResponse.push({
      //     message: e.constraints[key],
      //     field: e.property,
      //   });
      // });
      errorsForResponse.push({
        message: e.constraints[constraintsKeys[0]],
        field: e.property,
      });
    });
    throw new RpcException(errorsForResponse);
  },
};
