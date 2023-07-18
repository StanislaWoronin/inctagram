import {Posts} from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";
import {postConstant} from "../view-model/post.constant";
import {IsOptional, IsString, MaxLength} from "class-validator";
import {Transform} from "class-transformer";

type TCreatePostDto = Pick<Posts, 'description'>

export class CreatePostDto implements TCreatePostDto {
    @ApiProperty({
        example: 'Some description for the current post.',
        maxLength: postConstant.description.maxLength,
    })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @MaxLength(postConstant.description.maxLength)
    description: string
}

export class UploadPostImagesDto extends CreatePostDto {
    public userId: string;
    public postPhotos: Buffer[];
}