import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserFacade } from '../../users/application-services';
import {response} from "express";

@ValidatorConstraint({ name: 'IsConfirmationCodeExist', async: true })
@Injectable()
export class IsConfirmationCodeExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly userFacade: UserFacade) {}

  async validate(value: string) {
    const user = await this.userFacade.queries.getUserByConfirmationCode(value);
    if (!user) return false;
    if (user.isConfirmed)
      throw new BadRequestException(`confirmationCode:Email already confirm.`);
    if (Number(value) < Date.now())
      throw new BadRequestException(`confirmationCode:${user.email}`);
    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return `Incorrect ${args.property}.`;
  }
}

export function IsConfirmationCodeExist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsConfirmationCodeExistConstraint,
    });
  };
}
