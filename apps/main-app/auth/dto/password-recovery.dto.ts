import {EmailDto} from "./email.dto";
import {IsOptional} from "class-validator";
import {IsValidCaptcha} from "../../../../libs/decorators/is-valid-captcha.decorator";
import {ApiProperty} from "@nestjs/swagger";

export class PasswordRecoveryDto extends EmailDto {
    @ApiProperty({
        description: 'This field will be mandatory from the fifth week!',
        required: false
    })
    @IsOptional() // TODO убрать как фронты попросят
    @IsValidCaptcha()
    recaptchaValue: string;
}