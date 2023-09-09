
import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator"
export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  username: string

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  email: string

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string
}

export class SigninDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  email: string

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string
}
