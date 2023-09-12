import { ApiProperty } from '@nestjs/swagger';

export class RegistrationConfirmationView {
  @ApiProperty()
  email: string | null;

  @ApiProperty()
  status: RegistrationConfirmationResponse;

  static toView(
    status: RegistrationConfirmationResponse,
    email: string = null,
  ) {
    return {
      email,
      status,
    };
  }
}

export enum RegistrationConfirmationResponse {
  Success = 'success',
  Confirm = 'confirm',
  Invalid = 'invalid',
}
