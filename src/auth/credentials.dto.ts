import { IsString } from 'class-validator';

export class CredentialsDto {
  @IsString()
  public readonly username!: string;

  @IsString()
  public readonly password!: string;
}
