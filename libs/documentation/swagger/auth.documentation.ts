import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponse } from '../../shared/errors.response';
import { RegistrationDto } from '../../../apps/main-app/auth/dto/registration.dto';
import { ViewUser } from '../../../apps/main-app/users/view-model/user.view-model';
import { TokenResponseView } from '../../../apps/main-app/auth/view-model/token-response.view';
import { LoginDto } from '../../../apps/main-app/auth/dto/login.dto';
import { EmailDto } from '../../../apps/main-app/auth/dto/email.dto';
import { RegistrationConfirmationDto } from '../../../apps/main-app/auth/dto/registration-confirmation.dto';
import { NewPasswordDto } from '../../../apps/main-app/auth/dto/new-password.dto';
import { PasswordRecoveryDto } from '../../../apps/main-app/auth/dto/password-recovery.dto';
import {
  LoginView,
  TLoginView,
} from '../../../apps/main-app/auth/view-model/login.view-model';

export function ApiRegistration() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({ summary: 'A new user is registered in the system' }),
    ApiBody({
      type: RegistrationDto,
      required: true,
    }),
    ApiCreatedResponse({
      description:
        'Input data is accepted. Email with confirmation code will be send to' +
        ' passed email address.',
      type: ViewUser,
    }),
    // ApiResponse({
    //   status: HttpStatus.SEE_OTHER,
    //   description:
    //     'Email already exists but not confirmed, user can merge his profile.',
    //   type: RegistrationDto
    // }),
    ApiBadRequestResponse({
      description:
        'If the inputModel has incorrect values (in particular if the user with' +
        ' the given email or password already exists)',
      type: ErrorResponse,
    }),
    // ApiTooManyRequestsResponse({
    //   description: 'More than 5 attempts from one IP-address during 10 seconds',
    // }),
  );
}

export function ApiMergeProfile() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({
      summary: 'The user entered an existing and unconfirmed mail.',
    }),
    ApiBody({
      type: RegistrationDto,
      required: true,
    }),
    ApiCreatedResponse({
      description:
        'Input data is accepted. Email with confirmation code will be send to' +
        ' passed email address.',
      type: ViewUser,
    }),
  );
}

// export function ApiPasswordRecoveryPage() {
//   return applyDecorators(
//     ApiTags('Auth'),
//     ApiOperation({ summary: 'Page for sending a new password.' }),
//     ApiQuery({ type: PasswordRecoveryPageDto }),
//   );
// }

export function ApiLogin() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({ summary: 'New user login after registration' }),
    ApiBody({ type: LoginDto }),
    ApiOkResponse({
      description:
        'Returns JWT accessToken (expired after 10 seconds) in body and JWT' +
        ' refreshToken in cookie (http-only, secure) (expired after 20 seconds)',
      type: LoginView,
    }),
    ApiUnauthorizedResponse({
      description:
        'if a user with such an email does not exist or the password' +
        ' is not suitable for the profile registered with this email',
    }),
    // ApiTooManyRequestsResponse({
    //   description: 'More than 5 attempts from one IP-address during 10 seconds',
    // }),
  );
}

export function ApiRegistrationEmailResending() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({ summary: 'Re-sends registration confirmation code' }),
    ApiBody({
      type: EmailDto,
      required: true,
    }),
    ApiNoContentResponse({
      description:
        'Input data is accepted.Email with confirmation code will be send to passed' +
        ' email address.Confirmation code should be inside link as query param,' +
        ' for example: https://some-front.com/confirm-registration?code=yourCodeHere',
    }),
    ApiBadRequestResponse({
      description:
        'If the inputModel has incorrect values (in particular if the user with' +
        ' the given email or password already exists)',
      type: ErrorResponse,
    }),
    // ApiTooManyRequestsResponse({
    //   description: 'More than 5 attempts from one IP-address during 10 seconds',
    // }),
  );
}

export function ApiGitHubRegistration() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({
      summary:
        'Registration via github. If a profile with a gitHub email address exists on the system and is not verified, ' +
        'the user can merge their old account with the new, otherwise the user is prompted to login. If account with ' +
        'this mail not exists, then a new, create activated account with a random name and the user can immediately log in.',
    }),
  );
}

export function ApiGoogleRegistration() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({
      summary:
        'Registration via google. If a profile with a gitHub email address exists on the system and is not verified, ' +
        'the user can merge their old account with the new, otherwise the user is prompted to login. If account with ' +
        'this mail not exists, then a new, create activated account with a random name and the user can immediately log in.',
    }),
  );
}

export function ApiRegistrationConfirmation() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({
      summary:
        '' +
        'Confirmation of registration via confirmation code. ' +
        'If the email confirmation is successful or the email has already been redirected to the "congratulations" page.' +
        'If the verification code has expired, it will be redirected to the "resubmit link" page.',
    }),
    ApiQuery({
      type: RegistrationConfirmationDto,
      required: true,
    }),
    ApiNoContentResponse({
      description: 'Email was verified. Account was activated',
    }),
    ApiBadRequestResponse({
      description: 'If confirmation code incorrect.',
      type: ErrorResponse,
    }),
    // ApiTooManyRequestsResponse({
    //   description: 'More than 5 attempts from one IP-address during 10 seconds',
    // }),
  );
}

export function ApiPasswordRecovery() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({ summary: 'Password recovery request' }),
    ApiBody({
      type: PasswordRecoveryDto,
      required: true,
    }),
    ApiNoContentResponse({
      description:
        "Even if current email is not registered (for prevent user's email detection)",
    }),
    ApiBadRequestResponse({
      description:
        'If the inputModel has incorrect values (in particular if the user with' +
        ' the given email or password already exists)',
      type: ErrorResponse,
    }),
    // ApiTooManyRequestsResponse({
    //   description: 'More than 5 attempts from one IP-address during 10 seconds',
    // }),
  );
}

export function ApiNewPassword() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({ summary: 'Sending a new password' }),
    ApiBody({
      type: NewPasswordDto,
      required: true,
    }),
    ApiNoContentResponse({
      description: 'If code is valid and new password is accepted',
    }),
    ApiBadRequestResponse({
      description:
        'If the inputModel has incorrect values (in particular if the user with' +
        ' the given email or password already exists)',
      type: ErrorResponse,
    }),
    // ApiTooManyRequestsResponse({
    //   description: 'More than 5 attempts from one IP-address during 10 seconds',
    // }),
  );
}

export function ApiRefreshToken() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiCookieAuth(),
    ApiOperation({ summary: 'Update authorization tokens' }),
    ApiOkResponse({
      description:
        'Returns JWT accessToken (expired after 10 seconds) in body and JWT' +
        ' refreshToken in cookie (http-only, secure) (expired after 20 seconds).',
      type: TokenResponseView,
    }),
    ApiUnauthorizedResponse({
      description:
        'If the JWT refreshToken inside cookie is missing, expired or incorrect',
    }),
  );
}

export function ApiLogout() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({ summary: 'User logout' }),
    ApiCookieAuth(),
    ApiNoContentResponse({
      description: 'No Content',
    }),
    ApiUnauthorizedResponse({
      description:
        'If the JWT refreshToken inside cookie is missing, expired or incorrect',
    }),
  );
}

export function ApiDropDatabase() {
  return applyDecorators(
    ApiTags('Dev endpoints'),
    ApiOperation({
      summary: 'Clear database: delete all data from all tables/collections',
    }),
    ApiNoContentResponse({
      description: 'All data is deleted',
    }),
  );
}

export function GetUserFromDatabaseTest() {
  return applyDecorators(
    ApiTags('Dev endpoints'),
    ApiOperation({
      summary: 'Get user',
    }),
    ApiOkResponse({
      description: 'Get user',
    }),
  );
}
