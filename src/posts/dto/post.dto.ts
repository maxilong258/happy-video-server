import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator"

export class PostDto {
  @IsString()
  @IsNotEmpty()
  type: 'video' | 'painting'

  @IsString()
  @IsNotEmpty()
  @Length(1, 300)
  title: string

  @IsString()
  @IsNotEmpty()
  introduct: string

  @IsString()
  @IsOptional()
  coverPic?: string

  @IsString()
  @IsOptional()
  source?: string
}

export class findPostsDto {
  @IsString()
  @IsOptional()
  @Length(1, 300)
  title?: string

  @IsString()
  @IsOptional()
  type: 'video' | 'painting'

  @IsString()
  @IsOptional()
  page?: string

  @IsString()
  @IsOptional()
  limit?: string
}
