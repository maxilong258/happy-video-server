
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator"

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  username: string

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string
}

class UserProfileDto {
  @IsString()
  @IsOptional()
  avatar: string;

  @IsString()
  @IsOptional()
  country: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  birthday: string;

  @IsString()
  @IsOptional()
  introduction: string;

}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @Length(1, 20)
  username: string

  @IsString()
  @IsOptional()
  @Length(6, 20)
  password: string

  @IsOptional()
  @Type(() => UserProfileDto)
  userProfile: UserProfileDto
}

export class GetUserDto {
  @IsString()
  @IsOptional()
  page?: string

  @IsString()
  @IsOptional()
  limit? : string

  @IsString()
  @IsOptional()
  username?: string
}

export class collectDto {
  @IsNumber()
  @IsNotEmpty()
  postId: number
}