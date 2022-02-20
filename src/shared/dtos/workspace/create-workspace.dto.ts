import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  @MaxLength(50, {
    message:
      'Name is too long. Maximal length is $constraint1 characters, but actual is $value',
  })
  public name: string;

  @IsString()
  @MinLength(8, {
    message:
      'Password is too short. Minimal length is $constraint1 characters, but actual is $value',
  })
  public password: string;
}
