import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserFacade } from '../../apps/main-app/users/application-services';

@ValidatorConstraint({ name: 'IsEmailExist', async: true })
@Injectable()
export class IsEmailExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly userFacade: UserFacade) {}

  async validate(value: string) {
    const user = await this.userFacade.queries.getUserByIdOrUserNameOrEmail(
      value,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return !!user;
  }
}

export function IsEmailExist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailExistConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsEmailExistForRegistration', async: true })
@Injectable()
export class IsEmailExistForRegistrationConstraint
  implements ValidatorConstraintInterface
{
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

export function IsEmailExistForRegistration(
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailExistForRegistrationConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsEmailForPasswordRecoveryExist', async: true })
@Injectable()
export class IsEmailForPasswordRecoveryExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly userFacade: UserFacade) {}

  async validate(value: string) {
    const user = await this.userFacade.queries.getUserByIdOrUserNameOrEmail(
      value,
    );
    return !!user;
  }
  defaultMessage(args: ValidationArguments) {
    return `${args.property} is incorrect.`;
  }
}

export function IsEmailForPasswordRecoveryExist(
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailForPasswordRecoveryExistConstraint,
    });
  };
}
