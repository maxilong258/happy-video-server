import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator";

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 5000)
  content: string

  @IsNumber()
  @IsNotEmpty()
  postId: number
}
