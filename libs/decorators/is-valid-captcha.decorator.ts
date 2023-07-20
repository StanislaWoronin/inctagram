import {registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";
import {BadRequestException, Injectable} from "@nestjs/common";
import {RecaptchaAdapter} from "../adapters/recaptcha.adapter/recaptcha.adapter";

@ValidatorConstraint({name: 'IsValidCaptcha', async: true})
@Injectable()
export class IsValidCaptchaConstraint implements ValidatorConstraintInterface
{
    constructor(private readonly recaptchaAdapter: RecaptchaAdapter) {}

    async validate(value: string) {
        const isValid = await this.recaptchaAdapter.isValid(value)
        if (!isValid) {
            throw new BadRequestException('You are bot.')
        }
        return true
    }
}

export function IsValidCaptcha(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsValidCaptchaConstraint,
        });
    };
}