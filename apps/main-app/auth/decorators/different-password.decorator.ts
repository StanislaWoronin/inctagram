import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'IsValidBirthdayFormat', async: false })
@Injectable()
export class IsDifferentPasswordConstraint
  implements ValidatorConstraintInterface
{
  validate(value: string, args: ValidationArguments) {
    let password = args.object['password'];
    if (!password) password = args.object['newPassword'];
    const passwordConfirmation = args.object[args.property];
    if (password !== passwordConfirmation) return false;
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Passwords and password confirmation must match.`;
  }
}

export function IsDifferentPassword(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDifferentPasswordConstraint,
    });
  };
}
