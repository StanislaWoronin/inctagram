import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { decodeBirthday, encodeBirthday } from '../shared/helpers';

/**
 * The prism ORM refuses to save the string in the format new Date().toLocalDataString() -.
 * error: invalid binary data format.
 * It is necessary to bring the string in this format to the format YYYY.MM .
 */

@ValidatorConstraint({ name: 'IsValidBirthdayFormat', async: false })
@Injectable()
export class IsValidBirthdayFormatConstraint
  implements ValidatorConstraintInterface
{
  validate(value: string, args: ValidationArguments) {
    if (!value) return false;
    const regex = /\b(0[1-9]|[1-2]\d|3[01])\.(0[1-9]|1[0-2])\.\d{4}\b/;
    if (!regex.test(value)) return false;

    const currentDate = new Date();
    if (new Date(decodeBirthday(value)) >= currentDate) return false;

    const formattedDate = encodeBirthday(value);
    args.object[args.property] = new Date(formattedDate);
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Invalid ${args.property} format. Expected format: DD.MM.YYYY.`;
  }
}

export function IsValidBirthdayFormat(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidBirthdayFormatConstraint,
    });
  };
}
