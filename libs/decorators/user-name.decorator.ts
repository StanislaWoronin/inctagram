import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserFacade } from '../../apps/main-app/users/application-services';

@ValidatorConstraint({ name: 'IsUserNameExist', async: true })
@Injectable()
export class IsUserNameExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly userFacade: UserFacade) {}

  async validate(value: string) {
    const user = await this.userFacade.queries.getUserByIdOrUserNameOrEmail(
      value,
    );
    if (user) {
      if (!user.isConfirmed) {
        return true;
      }
    }
    return !user;
  }
  defaultMessage(args: ValidationArguments) {
    return `${args.property} already exists.`;
  }
}

export function IsUserNameExist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserNameExistConstraint,
    });
  };
}
