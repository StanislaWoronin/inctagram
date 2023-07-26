import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiFoundResponse,
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
import { RegistrationViaThirdPartyServicesDto } from '../../../apps/main-app/auth/dto/registration-via-third-party-services.dto';
import { settings } from '../../shared/settings';

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
      type: EmailDto,
      required: true,
    }),
    ApiOkResponse({
      description:
        'Input data is accepted. Email with confirmation code will be send to' +
        ' passed email address.',
      type: LoginView,
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
      description: `Returns JWT accessToken (expired after ${settings.timeLife.ACCESS_TOKEN}) in body and JWT refreshToken in cookie (http-only, secure) (expired after ${settings.timeLife.REFRESH_TOKEN})`,
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
      summary: 'Registration via github.',
      description:
        'If a profile with a gitHub email address exists on the system and is not verified, ' +
        'the user can merge their old account with the new, otherwise the user is prompted to login. ' +
        'If account with this mail not exists, then a new, create activated account with a random name ' +
        'and the user can immediately log in.',
    }),
    ApiQuery({
      type: RegistrationViaThirdPartyServicesDto,
      required: true,
    }),
    ApiOkResponse({
      description: `User is registered and log in. 
           Returns JWT accessToken (expired after ${settings.timeLife.ACCESS_TOKEN}) in body and JWT
           refreshToken in cookie (http-only, secure) (expired after ${settings.timeLife.REFRESH_TOKEN}).
           `,
      type: LoginView,
    }),
    ApiBadRequestResponse({
      description: 'If email from GitHub account already exists.',
      type: ErrorResponse,
    }),
    ApiUnauthorizedResponse({
      description:
        'If the code that came from the client is not valid or the token requested by the code has' +
        ' not been received or decoded',
    }),
  );
}

export function ApiGoogleRegistration() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({
      summary: 'Registration via google.',
      description:
        'If a profile with a gitHub email address exists on the system and is not verified, ' +
        'the user can merge their old account with the new, otherwise the user is prompted to login. ' +
        'If account with this mail not exists, then a new, create activated account with a random name ' +
        'and the user can immediately log in.',
    }),
    ApiOkResponse({
      description: `User is registered and log in. 
           Returns JWT accessToken (expired after ${settings.timeLife.ACCESS_TOKEN}) in body and JWT
           refreshToken in cookie (http-only, secure) (expired after ${settings.timeLife.REFRESH_TOKEN}).
           `,
      type: LoginView,
    }),
    ApiBadRequestResponse({
      description: 'If email from Google account already exists.',
      type: ErrorResponse,
    }),
    ApiUnauthorizedResponse({
      description:
        'If the code that came from the client is not valid or the token requested by the code has' +
        ' not been received or decoded',
    }),
  );
}

export function ApiRegistrationConfirmation() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({
      summary: 'Confirmation of registration via confirmation code.',
      description:
        'If the email confirmation is successful or the email has already been redirected to the "congratulations"' +
        ' page. If the verification code has expired, it will be redirected to the "resubmit link" page.',
    }),
    ApiQuery({
      type: RegistrationConfirmationDto,
      required: true,
    }),
    ApiFoundResponse({
      description:
        'Email was verified. Account was activated. Redirected to the "congratulations" page.',
    }),
    ApiBadRequestResponse({
      description:
        'If confirmation code incorrect. Redirected to the "resubmit link" page.',
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
      description: `Returns JWT accessToken (expired after ${settings.timeLife.ACCESS_TOKEN}) in body and JWT refreshToken in cookie (http-only, secure) (expired after ${settings.timeLife.REFRESH_TOKEN})`,
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
