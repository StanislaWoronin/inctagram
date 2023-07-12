import { ErrorResponse } from '../../libs/shared/errors.response';

export const errorsMessage = <T>(fields: (keyof T)[]): ErrorResponse => {
  const errors = [];

  for (const field of fields) {
    errors.push({
      message: expect.any(String),
      field: field as string,
    });
  }

  return { errors };
};
