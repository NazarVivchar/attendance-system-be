import { IsString, MinLength } from 'class-validator';

export class SignInToWorkspaceDto {
  @IsString()
  @MinLength(8, {
    message:
      'Password is too short. Minimal length is $constraint1 characters, but actual is $value',
  })
  public password: string;
}
