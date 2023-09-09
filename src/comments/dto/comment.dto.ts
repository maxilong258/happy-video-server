import { IsOptional, IsString } from "class-validator"

export class getCommentByPostDto {
  @IsString()
  @IsOptional()
  page?: string

  @IsString()
  @IsOptional()
  limit? : string

  @IsString()
  @IsOptional()
  userId?: string
}
